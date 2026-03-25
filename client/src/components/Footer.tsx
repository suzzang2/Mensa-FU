import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 40px 0px;
  margin-top: 40px;
  border-top: 1px solid #f3f4f6;
  background-color: #ffffff;
  color: #6b7280;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const DevInfo = styled.div`
  margin-bottom: 16px;
  
  .name {
    font-weight: 700;
    color: #696969;
    font-size: 0.8rem;
  }
  
  .role {
    font-size: 0.6rem;
    margin-left: 8px;
    color: #9ca3af;
  }
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;

  a {
    color: #9ca3af;
    text-decoration: none;
    font-size: 0.8rem;
    transition: color 0.2s;

    &:hover {
      color: #3b82f6; /* 마우스 올리면 파란색으로 변함 */
    }
  }
`;

const Copyright = styled.p`
  font-size: 0.8rem;
  color: #d1d5db;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <DevInfo>
          <span className="name">Subin Park</span>
          <span className="role">| Front-end Developer</span>
        </DevInfo>
        
        <p style={{ fontSize: '0.8rem', marginBottom: '8px', lineHeight: '1.6' }}>
          더욱 편리한 mensa 이용을 위해 제작된 비공식 웹사이트입니다.
        </p>

        <Links>
          <a href="https://github.com/suzzang2" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:burittodance@naver.com">Contact</a>
          {/* <a href="https://www.instagram.com/your-id" target="_blank" rel="noreferrer">Instagram</a> */}
        </Links>

        <Copyright>
          &copy; 2026 Mensa-FU-2 Guide. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;