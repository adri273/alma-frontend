export const initialState = {	//dataLayer inicial state
    pacientes: [],
};
const reducer = (state, action) => {	//acciones del reducer
    switch(action.type) {
        case 'NUEVO_PACIENTE':
            return {
                ...state,
                pacientes: [...state.basket, action.item],
            }
            
        default:
            break;
    }
};
export default reducer;