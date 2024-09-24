import { useContext, useEffect, useState } from 'react';
import InputField from '../../../InputField/InputField'
import './AdminLanguageList.css'
import { ILanguage } from '../../../../utils/models/language.model';
import { MdDelete, MdEdit, MdLibraryBooks } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import CustomButton from '../../../CustomButton/CustomButton';
import { IButtonColor } from '../../../CustomButton/ICustomButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import Popup from '../../../Popup/Popup';
import axiosInstance from '../../../../utils/axios';
import { AlertContext } from '../../../../context/AlertContext/AlertContext';
import { AlertType } from '../../../../context/AlertContext/IAlertContext';
import axios from 'axios';
import InputBox from '../../../InputBox/InputBox';

export default function AdminLanguageList() {

    const [search, setSearch] = useState<string>("");
    const [languages, setLanguages] = useState<ILanguage[]>([]);

    const [add, setAdd] = useState<boolean>(false);

    const { addAlert } = useContext(AlertContext);

    const [deleteLanguage, setDeleteLanguage] = useState<number>(-1);
    const [editLanguage, setEditLanguage] = useState<number>(-1);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        reset,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<ILanguage>();

    useEffect(() => {
        axiosInstance.get('/admin/language/all').then(res => {
            setLanguages(res.data.languages)
        })
    }, []);

    const onSubmit: SubmitHandler<ILanguage> = async (data) => {
        if(add) {
            try {
                await axiosInstance.post(`/admin/language`, data);
                addAlert({
                    type: AlertType.SUCCESS,
                    title: 'Success',
                    text: `Language ${data.id} created`
                })
    
                setLanguages([...languages, data])
                closePopup();
            } catch(error) {
                if(!axios.isAxiosError(error)) {
                    setError("root", { message: "This was not supposed to happen."});
                    return;
                }
                
                if(error.response && error.response.data && error.response.data.description) {
                    const errors = error.response.data.description;
                    for (let [key, value] of Object.entries(errors)) {
                        console.log(value)
                        setError(key as keyof ILanguage, { message: value as string });
                    }
                } else {
                    setError("root", { message: "The server failed to respond" });
                }
    
                throw error;
            }
        } else {
            try {
                await axiosInstance.put(`/admin/language`, data);
                addAlert({
                    type: AlertType.SUCCESS,
                    title: 'Success',
                    text: `Language ${data.id} updated`
                })
    
                setLanguages(languages.map(lang => 
                    lang.id === data.id ? { ...lang, ...data } : lang
                ));

                closePopup();
            } catch(error) {
                if(!axios.isAxiosError(error)) {
                    setError("root", { message: "This was not supposed to happen."});
                    return;
                }
                
                if(error.response && error.response.data && error.response.data.description) {
                    const errors = error.response.data.description;
                    for (let [key, value] of Object.entries(errors)) {
                        console.log(value)
                        setError(key as keyof ILanguage, { message: value as string });
                    }
                } else {
                    setError("root", { message: "The server failed to respond" });
                }
    
                throw error;
            }
        }
    }

    function closePopup() {
        setDeleteLanguage(-1);
        setEditLanguage(-1);
        setAdd(false);

        reset({});
        clearErrors();
    }

    function handleAddClick() {
        closePopup();
        setAdd(true);
    }

    function handleEditClick(index: number) {
        closePopup();
        setEditLanguage(index);
        setValue('id', languages[index].id);
        setValue('fileExtension', languages[index].fileExtension);
        setValue('compile', languages[index].compile);
        setValue('compileCommand', languages[index].compileCommand);
        setValue('runCommand', languages[index].runCommand);
    }

    function handleDeleteClick(index: number) {
        closePopup();
        setDeleteLanguage(index);
    }

    function confirmDeleteLanguage() {
        axiosInstance.delete(`/admin/language?id=${languages[deleteLanguage].id}`)
        .then(() => {
            addAlert({
                type: AlertType.SUCCESS,
                title: 'Success',
                text: `Language ${languages[deleteLanguage].id} deleted`
            })

            setLanguages(languages.slice(0, deleteLanguage).concat(languages.slice(deleteLanguage+1)));
        })
        .catch(() => addAlert({
            type: AlertType.DANGER,
            title: 'Error',
            text: 'This language cannot be deleted'
        }))
        closePopup();
    }

    return (
        <div className='admin-languages'>
            <div className='search-bar'>
                <h3>Languages</h3>
                <div className="bar-options">
                    <CustomButton text="+" color={IButtonColor.GREEN} onClick={ handleAddClick }></CustomButton>
                    <InputField value={search} onChange={ (e) => setSearch(e.target.value) } label='search' icon={<CiSearch />} placeholder='Search' />
                </div>
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Options</th>
                    </tr>
                    {
                        languages.filter(languages => languages.id.toLowerCase().includes(search.toLowerCase())).map((language, idx) => (
                            <tr key={idx}>
                                <td>{ language.id }</td>
                                <td className='options'>
                                    {
                                        <>
                                            <div className='option orange' onClick={ () => handleEditClick(idx) }>
                                                <MdEdit />
                                            </div>
                                            <div className='option red' onClick={ () => handleDeleteClick(idx) }>
                                                <MdDelete />
                                            </div>
                                        </>
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            { deleteLanguage !== -1
                &&
                <Popup title='Confirm Action' onClose={ closePopup }>
                        <p>Are you sure you want to delete this?</p>
                        <CustomButton text='Confirm' color={IButtonColor.GREEN} onClick={ confirmDeleteLanguage }/>
                </Popup>
            }
            {
                (editLanguage !== -1 || add) &&
                <Popup title={editLanguage !== -1 ? 'Edit Language' : 'Add Language'} onClose={ closePopup }>
                    <form className='language-popup' onSubmit={ handleSubmit(onSubmit) }>
                        <InputField
                            {...register('id', { required: 'Language ID is required' })}
                            error={errors.id}
                            label='language-id'
                            description='Language ID'
                            disabled={editLanguage !== -1}
                            icon={ <MdLibraryBooks /> }
                            placeholder='C++'
                        />
                        <InputField
                            {...register('fileExtension', { required: 'File extension is required' })}
                            error={errors.fileExtension}
                            label='file-extension'
                            description='File Extension'
                            icon={ <MdLibraryBooks /> }
                            placeholder='cpp'
                        />
                        <InputField
                            {...register('compileCommand', { required: 'Compile command is required' })}
                            error={errors.compileCommand}
                            label='compile-command'
                            description='Compile Command'
                            icon={ <MdLibraryBooks /> }
                            placeholder='/usr/bin/gcc'
                        />
                        <InputField
                            {...register('runCommand', { required: 'Run command is required' })}
                            error={errors.runCommand}
                            label='run-command'
                            description='Run Command'
                            icon={ <MdLibraryBooks /> }
                            placeholder='/usr/bin/gcc'
                        />
                        <InputBox
                            {...register('compile')}
                            error={errors.compile}
                            label='compile'
                            description='Compile'
                            placeholder='false'
                        />

                        <CustomButton disabled={ isSubmitting } type='submit' text={editLanguage !== -1 ? 'Confirm' : 'Add'} color={IButtonColor.GREEN} />
                        { errors.root && <span className='red'>{ errors.root.message }</span> }
                    </form>
                </Popup>
            }
        </div>
    )
}