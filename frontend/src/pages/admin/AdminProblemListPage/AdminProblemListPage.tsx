import './AdminProblemListPage.css'
import { useContext, useEffect, useState } from "react";
import InputField from "../../../components/InputField/InputField";
import { CiSearch } from "react-icons/ci";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { IButtonColor } from "../../../components/CustomButton/ICustomButton";
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdEdit, MdLibraryBooks } from 'react-icons/md';
import Popup from '../../../components/Popup/Popup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';
import { AlertType } from '../../../context/AlertContext/IAlertContext';
import { AlertContext } from '../../../context/AlertContext/AlertContext';

type CreateProblemInput = {
    id: string
}

interface Problem {
    id: string
    public: boolean
    title: string
}

export default function AdminProblemListPage() {

    const [search, setSearch] = useState<string>('');
    const [creatingProblem, setCreatingProblem] = useState<boolean>(false);
    const navigate = useNavigate();
    const { role, axiosInstance } = useContext(AuthContext);
    const { addAlert } = useContext(AlertContext);

    const [problems, setProblems] = useState<Problem[]>([]);

    useEffect(() => {
        if(role !== AuthRole.ADMIN) return;

        axiosInstance.get('/admin/problems')
            .then(res => {
                setProblems(res.data.problems);
            })
    }, [role]);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<CreateProblemInput>();

    const onSubmit: SubmitHandler<CreateProblemInput> = async (data) => {
        try {
            await axiosInstance.post(`/admin/problem`, data);
            addAlert({
                type: AlertType.SUCCESS,
                title: 'Success',
                text: `Problem ${data.id} created`
            })
            navigate(`/admin/problems/edit/${data.id}`)
        } catch(error) {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof CreateProblemInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }

            throw error;
        }
    }

    function closePopup() {
        setValue('id', '');
        setCreatingProblem(false);
    }

    return (
        <div className="admin-problems">
            <div className='search-bar'>
                <h3>Problems</h3>
                <div className="bar-options">
                    <CustomButton text="+" color={IButtonColor.GREEN} onClick={ () => setCreatingProblem(true) }></CustomButton>
                    <InputField value={search} onChange={ (e) => setSearch(e.target.value) } label='search' icon={<CiSearch />} placeholder='Search' />
                </div>
            </div>
            <table className='problem-list'>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Public</th>
                        <th>Options</th>
                    </tr>
                    {
                        problems.filter(problem => problem.id.toLowerCase().includes(search.toLowerCase())).map((problem, idx) => (
                            <tr key={idx}>
                                <td>{ problem.id }</td>
                                <td>{ problem.public.toString() }</td>
                                <td className='options'>
                                    <Link to={`/admin/problems/edit/${problem.id}`}>
                                        <div className='option orange'>
                                            <MdEdit />
                                        </div>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                creatingProblem &&
                <Popup title='Create Problem' onClose={ closePopup }>
                    <form className='create-problem' onSubmit={ handleSubmit(onSubmit) }>
                        <span>Problem ID</span>
                        <InputField
                            {...register('id', { required: 'Problem ID is required' })}
                            error={errors.id}
                            label='problem-id'
                            icon={ <MdLibraryBooks /> }
                            placeholder='problem-id'
                        />
                        <CustomButton disabled={ isSubmitting } type='submit' text='Confirm' color={IButtonColor.GREEN}/>
                        { errors.root && <span className='red'>{ errors.root.message }</span> }
                    </form>
                </Popup>
            }
        </div>
    )
}