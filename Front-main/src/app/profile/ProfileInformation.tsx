"use client";
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEdit } from 'react-icons/fa';
import { jwtDecode, type JwtPayload } from "jwt-decode"

interface DecodedToken extends JwtPayload {
  _id: string
}

interface User {
  name: string;
  email: string;
  phone: string;
  Adress: string;
  avatar?: string;
  id: string;
}

interface Props {
  user: User;
}

const ProfileInformation: React.FC<Props> = ({ user }) => {
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken")
              if (!token) throw new Error("Token non trouvé")
      
              const decoded = jwtDecode<DecodedToken>(token)
              const userId = decoded._id
              if (!userId) throw new Error("ID utilisateur non trouvé dans le token")
      const response = await fetch(`http://localhost/api/auth/updateProfileInfo/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Full_Name: formData.name,
          Email: formData.email,
          Phone_Number: formData.phone,
          Adress: formData.Adress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
      }

      const result = await response.json();
      alert(result.message || 'Profil mis à jour avec succès');

      // Mise à jour locale des données après succès
      setFormData({
        name: result.user.Full_Name,
        email: result.user.Email,
        phone: result.user.Phone_Number,
        Adress: result.user.Adress,
        id: result.user._id,
        avatar: user.avatar, // on garde l'avatar actuel si présent
      });

      setIsEditing(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative">
      {/* Icone edit */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        title={isEditing ? 'Annuler' : 'Modifier'}
      >
        <FaEdit size={20} />
      </button>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly={!isEditing}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center">
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly={!isEditing}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Verified
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="flex items-center">
            <FaPhone className="text-gray-400 mr-2" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              readOnly={!isEditing}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adress</label>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-400 mr-2" />
            <input
              type="text"
              name="Adress"
              value={formData.Adress}
              readOnly={!isEditing}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg shadow-lg transition-shadow ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl'
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInformation;
