import styled from "styled-components";
import Texto from "../Texto";
import styles from './CheckboxContainer.module.css'

const ChBtn = styled.input`
    cursor: pointer;
    appearance: none;
    width: 20px;
    height: 20px;
    border: .4px solid #B9B9B9;
    transition: 0.2s all linear;
    position: relative;
    border-radius: 2px;
    ~ label {
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
    }
    &:checked {
        accent-color: var(--primaria);
        border: 5px solid var(--primaria);
    }
    &::after {
        content: '';
    }
`;

function CheckboxContainer({ valor, setValor, label, name }) {

    return (
        <div className={styles.checkboxContainer}>
            <ChBtn value={valor} id={name} onChange={evento => setValor(evento.target.checked)} type="checkbox"></ChBtn>
            {(label) ?
                <label htmlFor={name} className={styles.label}>{label}</label>
            : ''}
        </div>
    )
}

export default CheckboxContainer