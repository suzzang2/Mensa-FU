import styled from 'styled-components';

const StyledHeader = styled.header`
  padding: 48px 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #9333ea; /* purple-600 */
  margin-bottom: 8px;
`;

const DateText = styled.p`
  color: #6b7280; /* gray-500 */
  font-weight: 500;
`;

const Underline = styled.div`
  margin: 16px auto 0;
  height: 4px;
  width: 80px;
  background-color: #c084fc; /* purple-400 */
  border-radius: 99px;
`;

const Header = () => {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <StyledHeader>
      <Title>🍴 FU Berlin Mensa II</Title>
      <DateText>{today}</DateText>
      <Underline />
    </StyledHeader>
  );
};

export default Header;