// PageHeader.jsx — uniform page header, no duplicate title in nav
export default function PageHeader({ icon, title, subtitle, children }) {
  return (
    <div className="ny-page-header">
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:13 }}>
          {icon && (
            <div style={{
              width:42, height:42, borderRadius:12,
              background:'rgba(201,168,76,0.11)', border:'1px solid rgba(201,168,76,0.22)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, flexShrink:0,
            }}>{icon}</div>
          )}
          <div>
            <h1 className="ny-page-title">{title}</h1>
            {subtitle && <p className="ny-page-sub">{subtitle}</p>}
          </div>
        </div>
        {children && <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>{children}</div>}
      </div>
    </div>
  );
}
