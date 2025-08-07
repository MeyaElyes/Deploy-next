import React, { useEffect, useState } from 'react';

export default function Footer() {
  const [footerHtml, setFooterHtml] = useState<string>('');
  const [themeCssUrls, setThemeCssUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        setLoading(true);
        setError(null);

        // Use the same environment variable pattern as your main page
        const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
        
        if (!wordpressUrl) {
          throw new Error('NEXT_PUBLIC_WORDPRESS_URL not configured');
        }

        console.log('Footer fetching from:', wordpressUrl);

        const res = await fetch(`${wordpressUrl}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `{
              astraFooterHtml
              astraAllCssUrls
            }`,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (json.errors) {
          const errors = json.errors as { message: string }[];
          throw new Error(errors.map((e) => e.message).join(', '));
        }

        console.log('Footer data received:', json.data);
        setFooterHtml(json.data?.astraFooterHtml || '');
        setThemeCssUrls(json.data?.astraAllCssUrls || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error fetching footer data');
          console.error('Footer fetch error:', err);
        } else {
          setError('An unknown error occurred');
          console.error('Unknown error:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  useEffect(() => {
    if (themeCssUrls.length === 0) return;
    
    console.log('Loading CSS URLs:', themeCssUrls);
    
    const links = themeCssUrls.map((url) => {
      if (document.querySelector(`link[href="${url}"]`)) {
        return null;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.type = 'text/css';
      document.head.appendChild(link);
      return link;
    }).filter(Boolean) as HTMLLinkElement[];

    return () => {
      links.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [themeCssUrls]);

  // Always render something, even if there's an error
  if (loading) {
    return (
      <div className="site ast-container">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading footer...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="site ast-container">
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          ⚠️ Footer Error: {error}
        </div>
        {/* Fallback footer */}
        <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <p>&copy; 2024 Kendrick Lamar Official. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  if (!footerHtml) {
    return (
      <div className="site ast-container">
        <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <p>&copy; 2024 Kendrick Lamar Official. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="site ast-container text-black">
      <footer
        className="site-footer"
        dangerouslySetInnerHTML={{ __html: footerHtml }}
      />
    </div>
  );
}