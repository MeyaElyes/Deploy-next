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
            query: `
              {
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
              }
            `,
          }),
        });

        const json = await res.json();
        if (json.errors) throw new Error(json.errors.map((e: any) => e.message).join(', '));

        setNavigationItems(json.data?.menu?.menuItems?.nodes || []);
        setThemeCssUrls(json.data?.astraAllCssUrls || []);
        setSiteInfo(json.data?.generalSettings || null);
        setLogoUrl(json.data?.siteLogo || null);
      } catch (err: any) {
        setError(err.message || 'Error fetching header data');
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
    <header className="bg-white font-[Poppins]">
      <div className="max-w-[1230px] mx-auto px-4">
        <div className="flex justify-between items-center h-[54px]">
          
          {/* Logo */}
          <div className="flex items-center mt-[6px]">
            {logoUrl ? (
              <a href={siteInfo?.url || '/'}>
                <img
                  src={logoUrl}
                  alt={siteInfo?.title || 'Site Logo'}
                  className="h-[62px] w-auto transition-transform duration-200 hover:scale-105"
                />
              </a>
            ) : (
              <a
                href={siteInfo?.url || '/'}
                className="text-2xl font-bold text-black hover:text-gray-600 transition-colors duration-200"
              >
                {siteInfo?.title || 'Site Title'}
              </a>
            )}
          </div>

          {/* Navigation */}
          {navigationItems.length > 0 && (
            <nav className="flex gap-2 mt-[6px]">
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.target || '_self'}
                  className="px-4 py-2 text-black font-medium text-lg rounded hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
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
