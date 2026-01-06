"use client";
import { useState } from "react";

// Typage des données du formulaire
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  // Utilisation de useState avec le typage de FormData
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  // Typage de l'événement dans handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour soumettre le formulaire, par exemple une requête API.
    alert("Message envoyé !");
  };

  return (
    <div className="contact-container">
      <h1>Contactez-nous</h1>
      <p>Nous serions heureux de répondre à vos questions ou préoccupations !</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Votre email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Écrivez votre message"
            rows={6}  // Remplacer "rows='6'" par "rows={6}"
            required
          ></textarea>
        </div>


        <button type="submit" className="submit-btn">
          Envoyer
        </button>
      </form>

      <style jsx>{`
        .contact-container {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 50px 20px;
          max-width: 800px;
          margin: 0 auto;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        h1 {
          font-size: 36px;
          color: #333;
          margin-bottom: 20px;
        }

        p {
          font-size: 18px;
          color: #666;
          margin-bottom: 40px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .form-group label {
          font-size: 16px;
          color: #333;
          margin-bottom: 5px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 2px solid #ddd;
          border-radius: 5px;
          margin-bottom: 15px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #d62480;
          outline: none;
        }

        .submit-btn {
          padding: 12px 25px;
          background: linear-gradient(90deg, #d62480, #3498db);
          color: white;
          font-size: 18px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .submit-btn:hover {
          transform: scale(1.05);
          background: linear-gradient(90deg, #3498db, #d62480);
        }

        @media (max-width: 768px) {
          .contact-container {
            padding: 30px 10px;
          }

          h1 {
            font-size: 30px;
          }

          .submit-btn {
            font-size: 16px;
            padding: 10px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
