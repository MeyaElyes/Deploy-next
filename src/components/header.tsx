import React, { useEffect, useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  parentId: string | null;
  cssClasses: string[];
  target: string | null;
}

interface SiteInfo {
  title: string;
  description: string;
  url: string;
}

export default function Header() {
  const [navigationItems, setNavigationItems] = useState<MenuItem[]>([]);
  const [themeCssUrls, setThemeCssUrls] = useState<string[]>([]);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeaderData() {
      try {
        const res = await fetch('http://kendrick-lamar-official-website.local/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `{
              astraSimpleHeader
              astraAllCssUrls
              siteLogo
              menu(id: "primary", idType: LOCATION) {
                menuItems {
                  nodes {
                    id
                    label
                    url
                    parentId
                    cssClasses
                    target
                  }
                }
              }
            }`,
          }),
        });

        const json = await res.json();

        if (json.errors) {
          const errors = json.errors as { message: string }[]; // Correct type for errors
          throw new Error(errors.map((e) => e.message).join(', '));
        }

        setNavigationItems(json.data?.menu?.menuItems?.nodes || []);
        setThemeCssUrls(json.data?.astraAllCssUrls || []);
        setSiteInfo(json.data?.generalSettings || null);
        setLogoUrl(json.data?.siteLogo || null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error fetching header data');
          console.error('Header fetch error:', err);
        } else {
          setError('An unknown error occurred');
          console.error('Unknown error:', err);
        }
      }
    }

    fetchHeaderData();
  }, []);

  useEffect(() => {
    if (themeCssUrls.length === 0) return;

    const links = themeCssUrls.map((url) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [themeCssUrls]);

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md my-4 flex items-center">
        <span className="text-xl mr-2">⚠️</span>
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  return (
    <header className="bg-black font-[Poppins]">
      <div className="max-w-[1230px] mx-auto px-4">
        <div className="flex justify-between items-center h-[82px]">
          <div className="flex items-center mt-[6px]">
            {logoUrl ? (
              <a href={siteInfo?.url || '/'}>
                <img
                  src={logoUrl}
                  alt={siteInfo?.title || 'Site Logo'}
                  className="h-[62px] w-auto transition-transform duration-200"
                />
              </a>
            ) : (
              <a
                href={siteInfo?.url || '/'}
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
              >
                {siteInfo?.title}
              </a>
            )}
          </div>

          {navigationItems.length > 0 && (
            <nav className="flex mt-[6px gap-6]" style={{ gap: '24px' }}>
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.target || '_self'}
                  className="px-4 py-2 font-medium text-lg rounded hover:text-gray-600 hover:bg-gray-100 no-underline"
                  style={{ color: 'black', textDecoration: 'none' }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
