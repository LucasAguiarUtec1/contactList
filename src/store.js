export const initialStore=()=>{
  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    contacts: [],
    isCreatedApiUser: false,
    firstFetchContacts: false,
    contactToEdit: {}
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
      case 'save_contacts': 
      console.log(`contacts: ${action.payload}`);
      return {
        ...store,
        contacts: action.payload,
        firstFetchContacts: true
      }
      case 'user_created':
        console.log('Actualizando user created');
        return {
          ...store,
          isCreatedApiUser: true
        }
        case 'add_contact':
          return {
            ...store,
            contacts: [...store.contacts, action.payload]
          }
        case 'delete_contact':
          const actualContacts = store.contacts.filter((contact) => contact.id !== action.payload);
          return {
            ...store,
            contacts: actualContacts
          }
        case 'save_contact_to_edit': 
          return {
            ...store,
            contactToEdit: action.payload
          }
        case 'edit_contact' :
          console.log('contact info' + JSON.stringify(action.payload));
          const newInfoContact = action.payload;
          const updatedContacts = store.contacts.map((contact) => {
            if (contact.id === newInfoContact.id) {
              return newInfoContact;
            }
            return contact;
          });
          return {
            ...store,
            contacts: updatedContacts 
          }
    default:
      throw Error('Unknown action.');
  }    
}
