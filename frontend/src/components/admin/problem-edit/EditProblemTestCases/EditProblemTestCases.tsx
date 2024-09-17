import { useContext, useEffect, useState } from 'react';
import './EditProblemTestCases.css'
import { AlertContext } from '../../../../context/AlertContext/AlertContext';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios';
import { FaFolder, FaUpload } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import Popup from '../../../Popup/Popup';
import CustomButton from '../../../CustomButton/CustomButton';
import { IButtonColor } from '../../../CustomButton/ICustomButton';
import { AlertType } from '../../../../context/AlertContext/IAlertContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputFile from '../../../InputFile/InputFile';
import Loading from '../../../Loading/Loading';
import { IAdminProblem } from '../../../../utils/models/admin.model';
import axios from 'axios';
import InputBox from '../../../InputBox/InputBox';

type TestCaseInput = {
    input: FileList,
    output: FileList
}

export default function EditProblemTestCases() {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<TestCaseInput>();
    const { addAlert } = useContext(AlertContext);
    const { id } = useParams();

    const [testCases, setTestCases] = useState<{id: string, visible: boolean}[]>([]);
    const [deleteTestCase, setDeleteTestCase] = useState<number>(-1);
    const [editTestCase, setEditTestCase] = useState<number>(-1);
    const [viewTestCase, setViewTestCase] = useState<number>(-1);
    const [newTestCase, setNewTestCase] = useState<boolean>(false);
    const [input, setInput] = useState<string | undefined>(undefined);
    const [output, setOutput] = useState<string | undefined>(undefined);

    const [problem, setProblem] = useState<IAdminProblem>();

    useEffect(() => {
        axiosInstance.get(`/admin/test-cases?id=${id}`)
            .then(res => {
                setTestCases(res.data.testCases);
            })
    }, [id]);

    function handleNewClick() {
        setNewTestCase(true);
        setDeleteTestCase(-1);
        setEditTestCase(-1);
    }

    function handleDeleteClick(index: number) {
        setDeleteTestCase(index)
    }

    function handleEditClick(index: number) {
        setEditTestCase(index);
        setNewTestCase(false);
    }

    function closeConfirmPopup() {
        setDeleteTestCase(-1);
    }

    function closeEditPopup() {
        setEditTestCase(-1);
        setNewTestCase(false);
    }

    function confirmDeleteTestCase() {
        axiosInstance.delete(`/admin/test-case?id=${testCases[deleteTestCase].id}`)
        .then(() => {
            addAlert({
                type: AlertType.SUCCESS,
                title: 'Success',
                text: `Test case ${deleteTestCase+1} deleted`
            })

            setTestCases(testCases.slice(0, deleteTestCase).concat(testCases.slice(deleteTestCase+1)));
        })
        .catch(() => addAlert({
            type: AlertType.DANGER,
            title: 'Error',
            text: 'This test case cannot be deleted'
        }))
        closeConfirmPopup();
    }

    useEffect(() => {
        axiosInstance.get(`/admin/problem?id=${id}`).then((res) => setProblem(res.data.problem));
    }, []);

    const onSubmit: SubmitHandler<TestCaseInput> = async (data) => {
        if(!problem) return;

        const formData = new FormData();
        formData.append('input', data.input[0])
        formData.append('output', data.output[0])

        if(newTestCase) {
            axiosInstance.post(`/admin/test-case?id=${problem.id}`, formData).then((res) => {
                addAlert({
                    type: AlertType.SUCCESS,
                    title: 'Success',
                    text: 'Test case added'
                })
                setNewTestCase(false)
                setTestCases(testCases.concat([res.data.testCase]))
            }).catch((error) => {
                if(!axios.isAxiosError(error)) {
                    setError("root", { message: "This was not supposed to happen."});
                    return;
                }
                
                if(error.response && error.response.data && error.response.data.description) {
                    const errors = error.response.data.description;
                    for (let [key, value] of Object.entries(errors)) {
                        setError(key as keyof TestCaseInput, { message: value as string });
                    }
                } else {
                    setError("root", { message: "The server failed to respond" });
                }
    
                throw error;
            })
        } else {
            axiosInstance.put(`/admin/test-case?id=${testCases[editTestCase].id}`, formData).then(() => {
                addAlert({
                    type: AlertType.SUCCESS,
                    title: 'Success',
                    text: 'Test case updated'
                })
                setEditTestCase(-1)
            }).catch((error) => {
                if(!axios.isAxiosError(error)) {
                    setError("root", { message: "This was not supposed to happen."});
                    return;
                }
                
                if(error.response && error.response.data && error.response.data.description) {
                    const errors = error.response.data.description;
                    for (let [key, value] of Object.entries(errors)) {
                        setError(key as keyof TestCaseInput, { message: value as string });
                    }
                } else {
                    setError("root", { message: "The server failed to respond" });
                }
    
                throw error;
            })
        }
    }

    function getTestCase(testCase: number) {
        setViewTestCase(testCase);
        axiosInstance.get(`/admin/test-case?id=${testCases[testCase].id}`).then((res) => {
            setInput(res.data.testCase.input);
            setOutput(res.data.testCase.output);
        })
    }

    function closeViewPopup() {
        setViewTestCase(-1);
    }

    function changeVisibility(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const isVisible = e.target.checked;

        axiosInstance.put(`/admin/test-case/visible?id=${testCases[index].id}`, {
            visible: isVisible
        }).then(() => {
            addAlert({
                type: AlertType.SUCCESS,
                title: 'Success',
                text: `Test case ${index+1} visibility updated`
            })
            setTestCases(prevTestCases =>
                prevTestCases.map((testCase, idx) =>
                    idx === index ? { ...testCase, visible: isVisible } : testCase
                )
            );
        });
    }

    return (
        <div className='edit-test-cases'>
            <CustomButton text='New test case' color={IButtonColor.GREEN} onClick={ handleNewClick }/>
            <table>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Visible </th>
                        <th>Options</th>
                    </tr>
                    {
                        testCases.map((testCase, idx) => (
                            <tr key={idx}>
                                <th className='view' onClick={ () => getTestCase(idx) }> <FaFolder /> { testCase.id }</th>
                                <th>{ `TestCase ${idx+1}` }</th>
                                <th> <InputBox label='visible' checked={ testCase.visible } onChange={ (e) => changeVisibility(e, idx) }/></th>
                                <th className='options'>
                                    <div className='option orange' onClick={ () => handleEditClick(idx) }>
                                        <MdEdit />
                                    </div>
                                    <div className='option red' onClick={ () => handleDeleteClick(idx) }>
                                        <MdDelete />
                                    </div>
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            { deleteTestCase !== -1
                &&
                <Popup title='Confirm Action' onClose={ closeConfirmPopup }>
                        <p>Are you sure you want to delete this?</p>
                        <CustomButton text='Confirm' color={IButtonColor.GREEN} onClick={ confirmDeleteTestCase }/>
                </Popup>
            }
            { (editTestCase !== -1 || newTestCase)
                &&
                <Popup title={`${editTestCase === -1 ? 'Add Test Case' : 'Edit Test Case'}`} onClose={ closeEditPopup }>
                    <form onSubmit={ handleSubmit(onSubmit) } >
                        <InputFile
                            icon={<FaUpload />}
                            label="input-file"
                            description='Input File'
                            accept=".txt"
                            error={errors.input}
                            {...register('input', {
                            required: 'File is required',
                            validate: {
                                singleFile: (files) => files.length === 1 || 'Please select only one file',
                                isTxtFile: (files) => files[0]?.name.endsWith('.txt') || 'Only .txt files are allowed'
                            }
                            })}
                        />
                        <InputFile
                            icon={<FaUpload />}
                            label="output-file"
                            description='Output File'
                            accept=".txt"
                            error={errors.output}
                            {...register('output', {
                            required: 'File is required',
                            validate: {
                                singleFile: (files) => files.length === 1 || 'Please select only one file',
                                isTxtFile: (files) => files[0]?.name.endsWith('.txt') || 'Only .txt files are allowed'
                            }
                            })}
                        />
                        {
                            editTestCase === -1
                            ?
                            <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.GREEN } text='Add' />
                            :
                            <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.GREEN } text='Save' />
                        }
                        { errors.root && <span className='red'>{ errors.root.message }</span> }
                        {
                            isSubmitting &&
                            <Loading />
                        }
                    </form>
                </Popup>
            }
            {
                viewTestCase !== -1 &&
                <Popup title={`View TestCase ${viewTestCase+1}`} onClose={ closeViewPopup }>
                    <h3>Input</h3>
                    <pre>
                        { input }
                    </pre>
                    <h3>Output</h3>
                    <pre>
                        { output }
                    </pre>
                </Popup>
            }
        </div>
    )
}