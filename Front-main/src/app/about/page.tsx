"use client";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="about-container">
      <section className="about-header">
        <h1>À propos de nous</h1>
        <p>Découvrez notre histoire et notre mission. Nous vous proposons les meilleurs accessoires pour votre téléphone !</p>
      </section>

      <section className="about-info">
        <div className="info-card">
          <h2>Notre Mission</h2>
          <p>Nous avons pour mission de vous offrir une gamme variée et de qualité d&aposaccessoires pour téléphones afin de répondre à vos besoins quotidiens en matière de technologie et d&aposinnovation.</p>
        </div>
        <div className="info-card">
          <h2>Pourquoi Nous Choisir ?</h2>
          <ul>
            <li>Produits de haute qualité</li>
            <li>Livraison rapide et fiable</li>
            <li>Service client disponible et réactif</li>
            <li>Garantie de satisfaction</li>
          </ul>
        </div>
      </section>

      <section className="about-map">
        <h2>Notre Localisation</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.090306915537!2d2.2944813160212665!3d48.85884437928729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671d31537024d%3A0x857a32cd6fcfd220!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1674000155264!5m2!1sfr!2sfr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section className="about-team">
        <h2>Notre Équipe</h2>
        <div className="team-members">
          <div className="team-member">
            <Image src="/images/team1.png" alt="Team Member 1" width={150} height={150} className="team-image" />
            <h3>Zekri Oumayma</h3>
            <p>Responsable des ventes</p>
          </div>
          <div className="team-member">
            <Image src="/images/team2.png" alt="Team Member 2" width={150} height={150} className="team-image" />
            <h3>Azouz Tarek</h3>
            <p>Responsable technique</p>
          </div>
        </div>
      </section>

      <section className="about-footer">
        <p>&copy; 2025 Accessoires Téléphones - Tous droits réservés</p>
      </section>

      <style jsx>{`
        .about-container {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 50px 20px;
          max-width: 1000px;
          margin: 0 auto;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .about-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .about-header h1 {
          font-size: 36px;
          color: #333;
        }

        .about-header p {
          font-size: 18px;
          color: #666;
        }

        .about-info {
          display: flex;
          gap: 40px;
          margin-bottom: 50px;
        }

        .info-card {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          flex: 1;
        }

        .info-card h2 {
          font-size: 24px;
          color: #131921;
          margin-bottom: 10px;
        }

        .info-card p,
        .info-card ul {
          font-size: 16px;
          color: #555;
        }

        .info-card ul {
          list-style-type: disc;
          margin-left: 20px;
        }

        .about-map {
          text-align: center;
          margin-bottom: 50px;
        }

        .about-map h2 {
          font-size: 24px;
          color: #131921;
          margin-bottom: 20px;
        }

        .map-container {
          max-width: 100%;
          border-radius: 8px;
          overflow: hidden;
        }

        .about-team {
          text-align: center;
          margin-bottom: 50px;
        }

        .about-team h2 {
          font-size: 24px;
          color: #131921;
          margin-bottom: 30px;
        }

        .team-members {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .team-member {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 200px;
        }

        .team-member h3 {
          font-size: 20px;
          color: #131921;
        }

        .team-member p {
          font-size: 16px;
          color: #555;
        }

        .team-image {
          border-radius: 50%;
        }

        .about-footer {
          text-align: center;
          font-size: 14px;
          color: #888;
        }

        @media (max-width: 768px) {
          .about-info {
            flex-direction: column;
          }

          .team-members {
            flex-direction: column;
            align-items: center;
          }

          .team-member {
            margin-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
