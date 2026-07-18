import Experiences from '../components/features/Experiences';
import ChatBox from '../components/features/ChatBox';
import useImages from '../hooks/useImages';
import './About.css';

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function About() {
  const { images } = useImages();
  const portrait = images.image_3 || images.image_1 || images.image_2;

  return (
    <div className="about-page">
      <section className="about-hero shell" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="eyebrow">About me</p>
          <h1 id="about-title">Curious by nature. Rigorous by training.</h1>
          <p>
            I&apos;m Akshat Guduru, a computer science and statistics student at the University of Central Florida.
            I care about difficult technical problems. I also care about making their solutions clear, useful, and human.
          </p>
          <a className="text-link" href="mailto:akshat.guduru@gmail.com">
            Start a conversation <ArrowIcon />
          </a>
        </div>

        <div className="portrait-frame">
          {portrait ? (
            <img src={portrait} alt="Akshat Guduru" />
          ) : (
            <div className="portrait-placeholder" aria-hidden="true">AG</div>
          )}
          <div className="portrait-caption">
            <span>Based in Orlando, FL</span>
            <span>UCF · Class of 2027</span>
          </div>
        </div>
      </section>

      <section className="about-statement">
        <div className="shell about-statement-grid">
          <p className="eyebrow">The short version</p>
          <div>
            <h2>I like work that sits between research and real-world engineering.</h2>
            <div className="statement-columns">
              <p>
                My current research focuses on multi-agent reinforcement learning, policy evaluation,
                and communication-efficient systems. I enjoy the uncertainty of research: forming a useful
                question, designing the right experiment, and being honest about what the result means.
              </p>
              <p>
                Outside the lab, I build full-stack products and machine-learning systems. That practical work
                keeps me grounded in performance, reliability, user experience, and the dozens of small decisions
                that separate a demo from a product.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="experience-section shell" aria-labelledby="experience-title">
        <div className="about-section-heading">
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title">Where I&apos;ve been learning and contributing.</h2>
        </div>
        <Experiences />
      </section>

      <section className="about-details shell" aria-label="Education and current focus">
        <article>
          <span>Education</span>
          <h3>University of Central Florida</h3>
          <p>B.S. Computer Science & B.S. Statistics, with a minor in Mathematics. Expected 2027.</p>
        </article>
        <article>
          <span>Current focus</span>
          <h3>Machine learning research</h3>
          <p>Multi-agent reinforcement learning, fault tolerance, and communication-efficient algorithms.</p>
        </article>
        <article>
          <span>Looking for</span>
          <h3>Ambitious technical teams</h3>
          <p>Software engineering and ML research opportunities where thoughtful experimentation matters.</p>
        </article>
      </section>

      <section className="chat-section shell" aria-labelledby="chat-section-title">
        <div className="chat-section-copy">
          <p className="eyebrow">Ask the portfolio</p>
          <h2 id="chat-section-title">Want the quick version?</h2>
          <p>Ask my assistant about my background, projects, or technical experience.</p>
        </div>
        <ChatBox />
      </section>
    </div>
  );
}

export default About;
