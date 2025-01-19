

import React from 'react';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} 근무시간 계산기 </p>
        <div className="footer-links">
          <a href="mailto:jsbang@suresofttech.com">
            jsbang@suresofttech.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
