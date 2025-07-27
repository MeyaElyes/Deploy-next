/*import React, { useEffect, useState } from 'react';

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

        const res = await fetch('http://kendrick-lamar-official-website.local/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
                {
                  astraFooterHtml
                  astraAllCssUrls
                }
            `,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (json.errors) {
          throw new Error(json.errors.map((e: any) => e.message).join(', '));
        }

        setFooterHtml(json.data?.astraFooterHtml || '');
        setThemeCssUrls(json.data?.astraAllCssUrls || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching footer data');
        console.error('Footer fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);


  useEffect(() => {
    if (themeCssUrls.length === 0) return;
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
          ⚠️ {error}
        </div>
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
}*/