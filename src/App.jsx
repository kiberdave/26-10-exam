const features = [
  {
    number: "01",
    title: "React",
    description: "Создавайте интерфейсы из небольших переиспользуемых компонентов.",
  },
  {
    number: "02",
    title: "Vite",
    description: "Запускайте проект мгновенно и собирайте его для публикации.",
  },
  {
    number: "03",
    title: "Начните с идеи",
    description: "Замените эту страницу своим приложением — всё уже готово.",
  },
];

function App() {
  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="На главную">
          <span className="brand-mark">r</span>
          <span>новый проект</span>
        </a>
        <span className="topbar-note">Ваше пространство для идей</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            React + Vite
          </p>
          <h1 id="hero-title">
            Всё начинается
            <br />
            <span>с чистого листа.</span>
          </h1>
          <p className="hero-description">
            Надёжная основа для вашего следующего проекта уже готова.
            Осталось добавить идею.
          </p>
          <a className="start-link" href="#features">
            Исследовать проект <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-outer" />
          <div className="art-orbit orbit-inner" />
          <div className="art-sun" />
          <div className="art-card">
            <span className="card-kicker">ваша идея</span>
            <span className="card-shape">
              <span />
            </span>
            <span className="card-caption">воплотите её</span>
          </div>
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✳</span>
        </div>

        <span className="hero-index">СТАРТ / 2026</span>
      </section>

      <section className="features" id="features" aria-labelledby="features-title">
        <div className="section-heading">
          <p className="eyebrow">ХОРОШАЯ ОСНОВА</p>
          <h2 id="features-title">Всё нужное. Ничего лишнего.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>Сделано для хороших идей.</span>
        <span>React · Vite</span>
      </footer>
    </main>
  );
}

export default App;
