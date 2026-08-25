'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DodajOglasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceText: '',
    type: 'Stan',
    category: 'Prodaja',
    size: '',
    country: 'Crna Gora',
    city: 'Podgorica',
    neighborhood: '',
    address: '',
    latitude: '',
    longitude: '',
    rooms: '1',
    bathrooms: '1',
    hasKitchen: true,
    featuredImage: '',
    images: '',
    referenceId: Math.floor(Date.now() / 1000)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        priceText: formData.priceText,
        location: {
          locationName: formData.country,
          child: {
            locationName: formData.city,
            child: formData.neighborhood ? { locationName: formData.neighborhood, child: null } : null
          }
        },
        type: formData.type,
        category: formData.category,
        size: Number(formData.size),
        characteristics: [
          { characteristicName: "Broj soba", characteristicValue: String(formData.rooms) },
          { characteristicName: "Broj kupatila", characteristicValue: String(formData.bathrooms) },
          { characteristicName: "Kuhinja", characteristicValue: formData.hasKitchen ? "true" : "false" }
        ],
        images: formData.images.split(',').map((img) => img.trim()).filter(Boolean),
        featuredImage: formData.featuredImage,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        referenceId: Number(formData.referenceId)
      };

      console.log("Slanje payload-a:", payload);

      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Oglas je uspješno kreiran i spreman za sinhronizaciju!');
      }, 1000);

    } catch (err) {
      setLoading(false);
      setErrorMsg('Došlo je do greške prilikom čuvanja oglasa.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Dodaj novu nekretninu (Master baza)</h1>

      {successMsg && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{successMsg}</div>}
      {errorMsg && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naslov oglasa *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="npr. Dvosoban stan u centru"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referentni ID (Automatski)</label>
            <input
              type="number"
              name="referenceId"
              readOnly
              value={formData.referenceId}
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opis nekretnine * (min. 10 karaktera)</label>
          <textarea
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detaljan opis nekretnine..."
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (€) *</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="150000"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tekst uz cijenu (opciono)</label>
            <input
              type="text"
              name="priceText"
              value={formData.priceText}
              onChange={handleChange}
              placeholder="npr. Dogovor"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Prodaja">Prodaja</option>
              <option value="Izdavanje">Izdavanje</option>
              <option value="Stan na dan">Stan na dan</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tip nekretnine *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Stan">Stan</option>
              <option value="Kuća">Kuća</option>
              <option value="Zemljište">Zemljište</option>
              <option value="Poslovni prostor">Poslovni prostor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Površina (m²) *</label>
            <input
              type="number"
              name="size"
              required
              value={formData.size}
              onChange={handleChange}
              placeholder="75"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Broj soba</label>
            <input
              type="text"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Država</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grad *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Podgorica"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naselje</label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Naselje"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Glavna slika (URL) *</label>
            <input
              type="url"
              name="featuredImage"
              required
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://primjer.com/slika1.jpg"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ostale slike (URL-ovi odvojeni zarezom)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://primjer.com/s2.jpg, https://primjer.com/s3.jpg"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          {loading ? 'Objavljivanje...' : 'Sačuvaj oglas i pošalji na portale'}
        </button>
      </form>
    </div>
  );
}
