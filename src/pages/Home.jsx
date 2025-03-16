import tomy from '../assets/img/tomy.jpeg'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const Home = () => {

	const { store, dispatch } = useGlobalReducer();
	const API_BASE_URL = "https://playground.4geeks.com/contact/agendas/lucas_aguiar/";
	const navigate = useNavigate();


	useEffect(() => {
		console.log("Hola este es un log");
		if (!store.isCreatedApiUser) {
		  fetch(API_BASE_URL, {
			method: 'POST',
			headers: {
			  "Content-Type": "application/json"
			}
		  })
		  .then((res) => {
			return res.json();
		  })
		  .then((data) => {
			dispatch({ type: 'user_created'});
		  })
		  .catch((error) => {
			console.log(error);
			console.error("Error en la solicitud:", error.message || error);
		  });
		}
	  }, [store.isCreatedApiUser, dispatch]);

	  useEffect(() => {
		console.log('isCreatedApi ' + store.isCreatedApiUser);
		console.log('firstaFetchContacts ' + store.firstFetchContacts);

		if (!store.firstFetchContacts) {
		  console.log('Solicito a la api los contactos');
		  fetch(`${API_BASE_URL}contacts`)
			.then((res) => {
			  console.log('Solicité contactos a la api');
			  return res.json();
			})
			.then((res) => {
				console.log(res);
			  if (res.contacts) {
				dispatch({ type: 'save_contacts', payload: res.contacts });
			  }
			})
			.catch((err) => {
			  console.log('Error al obtener los contactos', err);
			});
		}
	  }, [store.isCreatedApiUser, store.firstFetchContacts, dispatch]); 
	  
	  const deleteHandler = (id) => {
		console.log(`contact id: ${id}`);
		fetch(`${API_BASE_URL}contacts/${id}`, {
			method: 'DELETE',
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then((res) => {
			if (!res.ok) {
				return res.json().then((data) => {
					console.log('Error response from API:', data); // Agrega este log para ver la respuesta completa
					throw new Error(data.message || 'Error en la solicitud');
				  });
			}
		})
		.then((data) => {
			dispatch({type: 'delete_contact', payload: id});
		})
		.catch((err) => {
			console.log('Ocurrio un error al eliminar el contact', err);
			alert('Error al eliminar contacto');
		})
	  }

	  const editContactHandler = (contact) => {
		dispatch({type: 'save_contact_to_edit', payload: contact});
		navigate('/editContact');
	  }

	return (
		<div className="text-center mt-5 container-fluid">
		<h2 className="p-0 mb-4 mt-0">Lista de contactos</h2>
			<ul className="list-group">
				{store.contacts.length === 0 && <li className="list-group-item contactItem d-flex align-items-center justify-content-center text-xl-center">Aún no ha registrado contactos.</li>}
				{store.contacts.map((contact, indx) => (
					<li key={indx} className="list-group-item contactItem d-flex align-items-center">
					<div className="d-flex align-items-center w-100">
						<img className="perfilImage me-auto" src={tomy}/>
						<div className="infoContact me-auto">
							<h3 className="text-body text-sm-start">{contact.name}</h3>
							<p className="text-start">
							<FontAwesomeIcon icon={faLocationDot} size="sm" className="me-1" style={{color: "#c4c4c4",}} />
							{contact.address}
							</p>
							<p className="text-start">
								<FontAwesomeIcon icon={faPhone} size="sm" className="me-1" style={{color: "#c4c4c4",}}></FontAwesomeIcon>
								{contact.phone}
							</p>
							<p>
							<FontAwesomeIcon icon={faEnvelope} size="sm" className="me-1" style={{color: "#c4c4c4",}}></FontAwesomeIcon>
							{contact.email}
							</p>
						</div>
						<div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
							<div className="btn-group me-2" role="group" aria-label="First group">
								<button type="button" className="btn btn-success" onClick={(e) => editContactHandler(contact)}>
									<FontAwesomeIcon icon={faPen} size="sm" className="me-1" ></FontAwesomeIcon>
									Editar
								</button>
							</div>
							<div className="btn-group me-2" role="group" aria-label="Second group">
								<button type="button" className="btn btn-danger" onClick={(e) => deleteHandler(contact.id)}>
									<FontAwesomeIcon icon={faTrash} size="sm" className="me-1" ></FontAwesomeIcon>
									Eliminar
								</button>
							</div>
						</div>
					</div>
				</li>
				))}
			</ul>
		</div>
	);
}; 