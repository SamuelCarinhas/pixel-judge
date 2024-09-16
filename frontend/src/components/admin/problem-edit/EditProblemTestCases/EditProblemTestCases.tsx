import { useContext, useEffect, useState } from 'react';
import './EditProblemTestCases.css'
import { AlertContext } from '../../../../context/AlertContext/AlertContext';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios';
import { FaFolder } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import Popup from '../../../Popup/Popup';
import CustomButton from '../../../CustomButton/CustomButton';
import { IButtonColor } from '../../../CustomButton/ICustomButton';
import { AlertType } from '../../../../context/AlertContext/IAlertContext';
import { useForm } from 'react-hook-form';
import InputFile from '../../../InputFile/InputFile';

type TestCaseInput = {
    input: FileList,
    output: FileList
}

export default function EditProblemTestCases() {

    const {
        register,
        formState: { errors }
    } = useForm<TestCaseInput>();
    const { addAlert } = useContext(AlertContext);
    const { id } = useParams();

    const [testCases, setTestCases] = useState<{id: string}[]>([]);
    const [deleteTestCase, setDeleteTestCase] = useState<number>(-1);
    const [editTestCase, setEditTestCase] = useState<number>(-1);

    useEffect(() => {
        axiosInstance.get(`/admin/test-cases?id=${id}`)
            .then(res => {
                setTestCases(res.data.testCases);
            })
    }, [id]);

    function handleDeleteClick(index: number) {
        setDeleteTestCase(index)
    }

    function handleEditClick(index: number) {
        setEditTestCase(index);
    }

    function closeConfirmPopup() {
        setDeleteTestCase(-1);
    }

    function closeEditPopup() {
        setEditTestCase(-1);
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

    return (
        <div className='edit-test-cases'>
            <table>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Options</th>
                    </tr>
                    {
                        testCases.map((testCase, idx) => (
                            <tr key={idx}>
                                <th> <FaFolder /> { testCase.id }</th>
                                <th>{ `TestCase ${idx+1}` }</th>
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
            { editTestCase !== -1
                &&
                <Popup title='Edit Test Case' onClose={ closeEditPopup }>
                    <form>
                    <InputFile
                        icon={<FaFolder />}
                        label="input-file"
                        accept=".txt"
                        {...register('input', {
                        required: 'File is required',
                        validate: {
                            singleFile: (files) => files.length === 1 || 'Please select only one file',
                            isTxtFile: (files) => files[0]?.name.endsWith('.txt') || 'Only .txt files are allowed'
                        }
                        })}
                    />
                    {errors.input && <p>{errors.input.message}</p>}
                        <CustomButton text='Save' color={IButtonColor.GREEN} onClick={ confirmDeleteTestCase }/>
                    </form>
                </Popup>
            }
        </div>
    )
}