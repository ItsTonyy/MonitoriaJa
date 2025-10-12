import React from 'react';
import './landingPage.css';
import { Button } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import PublicIcon from '@mui/icons-material/Public';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import { useNavigate } from 'react-router-dom';
import estudantesColaborando from '/estudantes-colaborando.avif'
import estudante1 from '/estudante1.png'
import estudante2 from '/estudante2.png'
import estudante3 from '/estudante3.png'
import estudante4 from '/estudante4.png'
import professor1 from '/professor1.png'
import professor4 from '/professor4.png'



interface LandingPageProps {
  // Add any props if needed
}

const LandingPage: React.FC<LandingPageProps> = () => {

  const navigate = useNavigate();

  function handleClickLogin() {
    navigate('/MonitoriaJa/login');
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="brand-label">Monitoria Já</div>
            <h1>
              Transforme Seu<br />
              Futuro Com<br />
              <span className="highlight"> Aprendendo o Que</span><br />
              <span className="highlight">Você Sempre Quis</span>
            </h1>
            <Button 
              variant="contained" 
              className="cta-button"
              href="#programs"
              onClick={handleClickLogin}
            >
              Crie uma Conta
            </Button>
          </div>
          <div className="hero-image">
            <div className="image-container">
              <img 
                src={estudantesColaborando}
                alt="Students collaborating around a laptop" 
                className="main-image" 
              />
              <div className="icon-badge code-icon">
                <span>{'{ }'}</span>
              </div>
              <div className="icon-badge ai-icon">
                <span>AI</span>
              </div>
              <div className="icon-badge design-icon">
                <span>Dev</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partner Section */}
      <section className="partner-section">
        <div className="partner-content">
          <div className="partner-images">
            <div className="image-top">
              <img 
                src={estudante1} 
                alt="Student with laptop" 
                className="partner-image top-image" 
              />
            </div>
            <div className="image-bottom">
              <img 
                src={estudante2} 
                alt="Student with laptop" 
                className="partner-image bottom-image" 
              />
            </div>
          </div>
          <div className="partner-text">
            <h2>
              Seu Parceiro no<br />
              <span className="highlight-dark">Crescimento Pessoal <br /> e Profissional</span>
            </h2>
            <p className="partner-description">
              Na nossa plataforma, conectamos você a monitores experientes de todo o Brasil,
              prontos para te ajudar a ter sucesso no mundo do conhecimento. Seja para explorar um novo hobby,
              impulsionar sua carreira ou dominar uma disciplina difícil, nosso objetivo é que seu aprendizado
              esteja alinhado aos seus objetivos.
            </p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="benefit-content">
                  <h3>Aprendizado Online Flexível</h3>
                  <p>Estude no seu ritmo, de qualquer lugar do Brasil.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="benefit-content">
                  <h3>Monitores Especializados</h3>
                  <p>Encontre monitores verificados em qualquer assunto, prontos para te guiar.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="benefit-content">
                  <h3>Foco nos Seus Objetivos</h3>
                  <p>Aulas particulares ou em grupo feitas para alavancar seus estudos, carreira ou paixões.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section className="programs-section" id="programs">
        <div className="programs-content">
          <div className="programs-header">
            <h2>
              Monitores em Todas as Áreas, <br /> Desenhados para <span className="highlight-dark">o Seu Sucesso</span>
            </h2>
          </div>
          
          <div className="program-cards">
            <div className="program-card1">
              <div className="program-icon coding-icon">
                <CalculateIcon/>
              </div>
              <h3>Reforço e Domínio em Exatas</h3>
              <p>Encontre monitores de Matemática, Física, Química, Programação e Engenharia.
               Do básico ao avançado, prepare-se para provas e projetos complexos.</p>
            </div>
            
            <div className="program-card2">
              <div className="program-icon analytics-icon">
                <PublicIcon/>
              </div>
              <h3>Fluência e Argumentação em Humanas</h3>
              <p>Aulas de Idiomas, Redação, História, Direito e Filosofia. Melhore sua comunicação e visão crítica para o Enem e a vida profissional.</p>
            </div>
            
            <div className="program-card3">
              <div className="program-icon marketing-icon">
               <MicExternalOnIcon/>
              </div>
              <h3>Desenvolvimento Pessoal e Hobbies</h3>
              <p>Desenvolva talentos em Artes, Música, Culinária, Finanças e Marketing Digital. Aprenda a transformar suas paixões em novas habilidades valiosas.</p>
            </div>

          </div>
        </div>
      </section>
      
      {/* Instructor Section */}
      <section className="instructor-section">
        <div className="instructor-content">
          <div className="instructor-text">
            <h2>
              A Expertise que Você<br /> 
              Precisa para Aprender <br />
              <span className="highlight-dark">Qualquer Coisa</span>
            </h2>
            <p className="instructor-description">
              Nossos monitores trazem anos de experiência e paixão pelo ensino em suas respectivas áreas.
              Você terá acesso a conhecimento prático e estratégias valiosas, aprendendo diretamente com
              quem domina o assunto que você procura.
            </p>
          </div>
          
          <div className="instructor-profile">
            <div className="instructor-image-container">
              <img 
                src={professor1} 
                alt="Jordan Ellis, Data Analytics Expert" 
                className="instructor-image" 
              />
              <div className="color-dot dot-blue"></div>
              <div className="color-dot dot-yellow"></div>
              <div className="color-dot dot-green"></div>
              <div className="color-dot dot-pink"></div>
            </div>
            
            <div className="instructor-card">
              <h3>Monitor em Destaque</h3>
              <h4>Felipe Mello, Especialista em Cálculo I e II</h4>
              <ul className="instructor-credentials">
                <li>Mestre em Engenharia com foco em Matemática Aplicada</li>
                <li>Mais de 8 anos ensinando Exatas para universitários de todo o Brasil</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-content">
          <div className="testimonials-left">
            <h2>
              Realize Seus Objetivos: <br /> 
              <span className="highlight-dark">O que Dizem Nossos Estudantes</span> 
            </h2>
            <p className="testimonials-intro">
              Junte-se a milhares de estudantes que alcançaram seus objetivos — seja na carreira, nos estudos ou em um novo hobby — com a ajuda dos nossos monitores.
            </p>
          </div>
          
          <div className="testimonials-right">
            <div className="testimonial-card">
              <div>
                <div className="quote-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#4285f4">
                    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                  </svg>
                </div>
                <p className="testimonial-text">
                  "Eu estava lutando para passar em Cálculo I na faculdade e não sabia por onde começar.
                   Meu monitor me deu a base e a confiança que eu precisava para dominar o assunto e tirar
                    uma nota excelente no semestre."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Sofia Almeida </h4>
                    <p>Estudante de Engenharia</p>
                  </div>
                </div>
              </div>
              
              <div className="author-image">
                  <img 
                    src={estudante3} 
                    alt="Emma Carter" 
                  />
              </div>
            </div>
            
            <div className="testimonial-card">
              <div>
                <div className="quote-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#4285f4">
                    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                  </svg>
                </div>
                <p className="testimonial-text">
                  Meu monitor de Inglês para Negócios foi um divisor de águas.
                  Consegui a fluência e a confiança para assumir um cargo internacional
                  na minha empresa, algo que eu jamais pensei ser possível.
                </p>
                <div className="testimonial-author">
                  
                  <div className="author-info">
                    <h4>Carlos Santos</h4>
                    <p>Analista Sênior</p>
                  </div>
                </div>
              </div>
              
              <div className="author-image">
                  <img 
                    src={professor4} 
                    alt="Priya Kumar" 
                  />
                </div>
            </div>
            
            <div className="testimonial-card">
              <div>
                <div className="quote-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#4285f4">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                </svg>
                </div>
                <p className="testimonial-text">
                  "Sempre quis aprender a tocar violão, mas não tinha método.
                   Com meu monitor, aprendi do zero a ler partituras e hoje toco minhas músicas favoritas.
                    Foi um investimento no meu bem-estar."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Mariana Lima</h4>
                    <p>Contadora e Músico Amadora</p>
                  </div>
                </div>
              </div>
              
              <div className="author-image">
                  <img 
                    src={estudante4} 
                    alt="Michael Johnson" 
                  />
                </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="questions-section" id="programs">
        <div className="programs-content">
          <div className="programs-header">
            <h2>
              Perguntas Frequentes
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;