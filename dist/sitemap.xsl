<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="tr">
      <head>
        <title>XML Sitemap &#8212; RoboParça</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #1e293b;
            background: #f8fafc;
            margin: 0;
            padding: 24px 16px;
            line-height: 1.5;
          }
          .sitemap-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            overflow: hidden;
          }
          .sitemap-header {
            padding: 28px 32px 24px;
            border-bottom: 1px solid #e2e8f0;
            background: #ffffff;
          }
          .sitemap-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 8px;
          }
          .sitemap-title {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .rm-badge {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 4px 10px;
            border-radius: 9999px;
            background: #ecfdf5;
            color: #059669;
            border: 1px solid #a7f3d0;
            letter-spacing: 0.5px;
          }
          .sitemap-desc {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 16px;
            line-height: 1.6;
          }
          .sitemap-desc a {
            color: #0284c7;
            text-decoration: none;
          }
          .sitemap-desc a:hover {
            text-decoration: underline;
          }
          .sitemap-stats {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f1f5f9;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
          }
          .sitemap-count {
            background: #0284c7;
            color: #ffffff;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
          }
          .table-responsive {
            width: 100%;
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13.5px;
            text-align: left;
          }
          thead th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 700;
            padding: 12px 16px;
            border-bottom: 2px solid #e2e8f0;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }
          tbody td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }
          tbody tr:nth-child(even) {
            background-color: #fafbfc;
          }
          tbody tr:hover {
            background-color: #f0f9ff;
          }
          tbody td a {
            color: #0284c7;
            text-decoration: none;
            font-weight: 500;
            word-break: break-all;
          }
          tbody td a:hover {
            color: #0369a1;
            text-decoration: underline;
          }
          .date-cell {
            white-space: nowrap;
            color: #64748b;
            font-size: 12.5px;
          }
          .pill-freq {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
            text-transform: capitalize;
          }
          .pill-priority {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            background: #f1f5f9;
            color: #64748b;
          }
          .priority-high {
            background: #dcfce7;
            color: #15803d;
            border: 1px solid #bbf7d0;
          }
          .priority-med {
            background: #e0f2fe;
            color: #0369a1;
            border: 1px solid #bae6fd;
          }
          .sitemap-footer {
            padding: 16px 32px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #94a3b8;
            flex-wrap: wrap;
            gap: 8px;
          }
          .sitemap-footer a {
            color: #64748b;
            text-decoration: none;
          }
          .sitemap-footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="sitemap-wrapper">
          <div class="sitemap-header">
            <div class="sitemap-title-row">
              <h1 class="sitemap-title">
                <span>XML Sitemap</span>
                <span class="rm-badge">Rank Math Style</span>
              </h1>
              <div class="sitemap-stats">
                <span>Total URLs:</span>
                <span class="sitemap-count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
              </div>
            </div>
            <p class="sitemap-desc">
              Bu XML Site Haritası, Google, Bing ve Yandex gibi arama motorlarının sitenizi en hızlı ve eksiksiz şekilde dizine eklemesi için programatik SEO motoru tarafından oluşturulmuştur.
              Site haritaları hakkında daha fazla bilgi: <a href="https://sitemaps.org" target="_blank" rel="noopener">sitemaps.org</a>.
            </p>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style="width: 58%;">URL</th>
                  <th style="width: 16%;">Son Güncelleme</th>
                  <th style="width: 14%;">Değişim Sıklığı</th>
                  <th style="width: 12%;">Öncelik</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="date-cell">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                    <td>
                      <span class="pill-freq">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:priority &gt;= 0.9">
                          <span class="pill-priority priority-high">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority &gt;= 0.7">
                          <span class="pill-priority priority-med">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="pill-priority">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          <div class="sitemap-footer">
            <span>XML Sitemap Protokolü 0.9 ile %100 uyumludur</span>
            <span><a href="https://roboparca.github.io/">RoboParça</a></span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>