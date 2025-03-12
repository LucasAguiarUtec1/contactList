import useGlobalReducer from "../hooks/useGlobalReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const AddContact = () => {
  const { store, dispatch } = useGlobalReducer();
  
  const navigate = useNavigate();

  const location = useLocation();

  const [name, setName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numero, setNumero] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    direccion: "",
    numero: "",
    email: ""
  });

  useEffect(() => {

    if (location.pathname === '/addContact') {
      setName("");
      setDireccion("");
      setNumero("");
      setEmail("");
      setErrors({
        name: "",
        direccion: "",
        numero: "",
        email: ""
      });
    }

    if (Object.keys(store.contactToEdit).length > 0 && location.pathname === '/editContact') {
      const contact = store.contactToEdit;
      setName(contact.name);
      setDireccion(contact.address);
      setNumero(contact.phone);
      setEmail(contact.email);
    }
  }, [location.pathname])

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Por favor, intorduza el nombre del contacto";
    if (!direccion) newErrors.direccion = "Por favor, introduzca la direccion del contacto";
    if (!numero) newErrors.numero = "Por favor, introduzca el numero del contacto"
    if (!email) newErrors.email = "Por favor, introduzca el email del contacto";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmitForm = (event) => {
    event.preventDefault();

    if (validateForm()) {
      const newContact = {
        name,
        address: direccion,
        phone: numero.toString(),
        email
      }
      if (location.pathname === '/addContact') {
        fetch('https://playground.4geeks.com/contact/agendas/lucas_aguiar/contacts', {
          method: 'POST',
          body: JSON.stringify(newContact),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then((res) => {
          return res.json().then((data) => {
            if (!res.ok) {
              console.log('Error response from API:', data);  // Agrega este log para ver la respuesta completa
              throw new Error(data.message || 'Error en la solicitud');
            }
            return data;
          });
        })
        .then((data) => {
          console.log('Contacto creado con éxito:', data);
          setName("");
          setDireccion("");
          setNumero("");
          setEmail("");
          setErrors({
            name: "",
            direccion: "",
            numero: "",
            email: "",
          });
          dispatch({type: 'add_contact', payload: newContact});
          alert('Contacto añadido con éxito!');
        })
        .catch((err) => {
          console.log('Error al crear contacto:', err);
          alert('Ocurrió un error al agregar el contacto.');
        });
      }
      else {
        fetch(`https://playground.4geeks.com/contact/agendas/lucas_aguiar/contacts/${store.contactToEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(newContact),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          dispatch({type: 'edit_contact', payload: res});
          setName("");
          setDireccion("");
          setNumero("");
          setEmail("");
          setErrors({
            name: "",
            direccion: "",
            numero: "",
            email: "",
          });
          alert('Contacto editado con exito');
          navigate('/');
        })
      }
      
    }
  }

  return (
    <div className="container-fluid text-center">
      {location.pathname === '/editContact' ? <h1>Editar contacto</h1> : <h1>Añadir nuevo contacto</h1>}
      <div className="container">
        <FontAwesomeIcon
          icon={faUser}
          size="2xl"
          className="mb-5 mt-3 rounded-circle contactLogo"
        ></FontAwesomeIcon>
        <form onSubmit={handleSubmitForm}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="floatingName"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="floatingName">Nombre</label>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
              id="floatingDireccion"
              placeholder="Direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <label htmlFor="floatingDireccion">Direccion</label>
            {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              className={`form-control ${errors.numero ? "is-invalid" : ""}`}
              id="floatingNumero"
              placeholder="Numero de Telefono"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
            <label htmlFor="floatingNumero">Numero de Telefono</label>
            {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email</label>
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <button className="btn btn-success" type="submit">
            {location.pathname === '/editContact' ? 'Editar Contacto' : 'Añadir Contacto'}
            
            </button>
        </form>
      </div>
    </div>
  );
}
