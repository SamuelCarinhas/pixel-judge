import './AdminContestListPage.css'
import { useContext, useEffect, useState } from "react";
import InputField from "../../../components/InputField/InputField";
import { CiSearch } from "react-icons/ci";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { IButtonColor } from "../../../components/CustomButton/ICustomButton";
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdDelete, MdEdit, MdLibraryBooks } from 'react-icons/md';
import Popup from '../../../components/Popup/Popup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';
import { AlertType } from '../../../context/AlertContext/IAlertContext';
import { AlertContext } from '../../../context/AlertContext/AlertContext';
import InputDate from '../../../components/InputDate/InputDate';

type CreateContestInput = {
    title: string,
    startDate: Date,
    endDate: Date
}

interface Contest {
    id: string
    title: string
    visible: boolean
    startDate: Date
    endDate: Date
}

export default function AdminContestListPage() {

    const [search, setSearch] = useState<string>('');
    const [creatingContest, setCreatingContest] = useState<boolean>(false);
    const navigate = useNavigate();
    const { role, axiosInstance } = useContext(AuthContext);
    const { addAlert } = useContext(AlertContext);

    const [contests, setContests] = useState<Contest[]>([]);

    useEffect(() => {
        if(role !== AuthRole.ADMIN) return;

        axiosInstance.get('/admin/contest/all')
            .then(res => {
                const data = res.data.contests as Contest[];
                data.forEach(contest => {
                    contest.startDate = new Date(contest.startDate),
                    contest.endDate = new Date(contest.endDate)
                })

                setContests(data);
            })
    }, [role]);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<CreateContestInput>();

    const onSubmit: SubmitHandler<CreateContestInput> = async (data) => {
        console.log(data);
        try {
            const res = await axiosInstance.post(`/admin/contest`, data);
            const contest = res.data.contest as Contest;
            addAlert({
                type: AlertType.SUCCESS,
                title: 'Success',
                text: `Contest ${data.title} created`
            })
            navigate(`/admin/contest/edit/${contest.id}`)
        } catch(error) {
            console.log(1);
            console.log(error);

            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                console.log(errors);
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof CreateContestInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }
        }
    }

    function closePopup() {
        setValue('title', '');
        setCreatingContest(false);
    }

    return (
        <div className="admin-contests">
            <div className='search-bar'>
                <h3>Contests</h3>
                <div className="bar-options">
                    <CustomButton text="+" color={IButtonColor.GREEN} onClick={ () => setCreatingContest(true) }></CustomButton>
                    <InputField value={search} onChange={ (e) => setSearch(e.target.value) } label='search' icon={<CiSearch />} placeholder='Search' />
                </div>
            </div>
            <table className='problem-list'>
                <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Start</th>
                        <th>Finish</th>
                        <th>Public</th>
                        <th>Options</th>
                    </tr>
                    {
                        contests.filter(contest => contest.title.toLowerCase().includes(search.toLowerCase())).map((contest, idx) => (
                            <tr key={idx}>
                                <td>{ contest.title }</td>
                                <td>{ contest.startDate.toLocaleString() }</td>
                                <td>{ contest.endDate.toLocaleString() }</td>
                                <td>{ contest.visible.toString() }</td>
                                <td className='options'>
                                    <Link to={`/admin/contest/edit/${contest.id}`}>
                                        <div className='option orange'>
                                            <MdEdit />
                                        </div>
                                    </Link>
                                    <div className='option red'>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                creatingContest &&
                <Popup title='Create Contest' onClose={ closePopup }>
                    <form className='create-contest' onSubmit={ handleSubmit(onSubmit) }>
                        <InputField
                            {...register('title', { required: 'Contest title is required' })}
                            error={errors.title}
                            description='Title'
                            label='contest-title'
                            icon={ <MdLibraryBooks /> }
                            placeholder='contest-title'
                        />
                        <InputDate
                            {...register('startDate', { required: 'Contest start date is required' })}
                            error={errors.startDate}
                            description='Start Date'
                            label='contest-start-date'
                            placeholder='contest-start-date'
                        />
                        
                        <InputDate
                            {...register('endDate', { required: 'Contest end date is required' })}
                            error={errors.endDate}
                            description='End Date'
                            label='contest-end-date'
                            placeholder='contest-end-date'
                        />
                        <CustomButton disabled={ isSubmitting } type='submit' text='Confirm' color={IButtonColor.GREEN}/>

                        { errors.root && <span className='red'>{ errors.root.message }</span> }
                    </form>
                </Popup>
            }
        </div>
    )
}