import { useState, type ChangeEvent, type SubmitEventHandler } from 'react';
import './RegistrationForm.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

interface AddressSuggestion {
  properties: {
    label: string;
  };
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: ''
  });

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddressChange = async (value: string) => {
    setFormData({ ...formData, address: value });

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
    }
  };

  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    setFormData({ ...formData, address: suggestion.properties.label });
    setShowSuggestions(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log('Données du formulaire:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="form-container">
      <h1>Formulaire d'Inscription</h1>

      {submitted && <div className="success-message">Inscription réussie! Merci {formData.firstName}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Entrez votre prénom"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Entrez votre nom"
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
            required
            placeholder="Entrez votre email"
          />
        </div>

        <div className="form-group address-group">
          <label htmlFor="address">Adresse</label>
          <div className="address-input-container">
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Commencez à taper votre adresse..."
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item" onClick={() => handleSelectAddress(suggestion)}>
                    {suggestion.properties.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
