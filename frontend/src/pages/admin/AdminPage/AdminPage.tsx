import { IoIosOptions } from 'react-icons/io'
import './AdminPage.css'
import { FaClipboardList, FaTrophy } from 'react-icons/fa'
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md'
import { ReactNode, useState } from 'react'
import AdminUsers from '../../../components/admin/AdminUsers/AdminUsers'

export default function AdminPage() {

    const [activeDropdown, setActiveDropdown] = useState<boolean[]>([false, false, false]);
    const [currentComponent, setCurrentComponent] = useState<ReactNode>(undefined);
    const [currentHeader, setCurrentHeader]= useState<string>("");

    const dropdowns = [
        {
            title: 'General',
            icon: <IoIosOptions />,
            options: [
                {
                    title: "Users",
                    component: <AdminUsers />,
                },
                {
                    title: "System Config",
                    component: undefined
                }
            ]
        },
        {
            title: 'Problems',
            icon: <FaClipboardList />,
            options: [
                {
                    title: "Problem List",
                    component: undefined
                },
                {
                    title: "Create Problem",
                    component: undefined
                }
            ]
        },
        {
            title: 'Contests',
            icon: <FaTrophy />,
            options: [
                {
                    title: "Contests List",
                    component: undefined
                },
                {
                    title: "Create Contest",
                    component: undefined
                }
            ]
        }
    ]

    function toggleDropdown(idx: number) {
        const dropdowns = [...activeDropdown];
        dropdowns[idx] = !dropdowns[idx];
        setActiveDropdown(dropdowns);
    }

    function updateOption(option: {
        title: string,
        component: ReactNode
    }) {
        setCurrentComponent(option.component);
        setCurrentHeader(option.title);
    }

    return (
        <div className='admin-page'>
            <div className='side-bar'>
                {
                    dropdowns.map((dropdown, idx) => (
                        <div className={`item ${activeDropdown[idx] ? 'active' : ''}`} key={idx}>
                            <div className='dropdown' onClick={() => toggleDropdown(idx)}>
                                <div className='text'>
                                  { dropdown.icon } { dropdown.title }
                                </div>
                                <MdKeyboardArrowDown className='arrow' />
                            </div>
                            <div className='options'>
                                {
                                    dropdown.options.map((option, idx) => (
                                        <div className={`option ${option.title === currentHeader ? 'selected' : ''}`} key={idx} onClick={ () => updateOption( option ) }>
                                            { option.title }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='content'>
                <div className='header'>
                    Admin <MdKeyboardArrowRight /> { currentHeader }
                </div>
                <div className='component'>
                    { currentComponent }
                </div>
            </div>
        </div>
    )
}