import { IoIosOptions } from 'react-icons/io'
import './AdminContainer.css'
import { FaClipboardList, FaTrophy } from 'react-icons/fa'
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md'
import { useEffect, useState } from 'react'
import IAdminContainer from './IAdminContainer'
import { Link, useLocation } from 'react-router-dom'
import '../../../utils/string.utils'

export default function AdminContainer(props: IAdminContainer) {

    const [activeDropdown, setActiveDropdown] = useState<boolean[]>([false, false, false])
    const path = useLocation();

    const dropdowns = [
        {
            title: 'General',
            icon: <IoIosOptions />,
            options: [
                {
                    title: "Logs",
                    path: '/admin/logs'
                },
                {
                    title: "Users",
                    path: '/admin/users'
                },
                {
                    title: "System Config",
                    path: '/admin/system-config'
                }
            ]
        },
        {
            title: 'Problems',
            icon: <FaClipboardList />,
            options: [
                {
                    title: "Problem List",
                    path: '/admin/problems'
                }
            ]
        },
        {
            title: 'Contests',
            icon: <FaTrophy />,
            options: [
                {
                    title: "Contests List",
                    path: '/admin/contests'
                }
            ]
        }
    ]

    function toggleDropdown(idx: number) {
        const dropdowns = [...activeDropdown];
        dropdowns[idx] = !dropdowns[idx];
        setActiveDropdown(dropdowns);
    }

    useEffect(() => {
        const idx = dropdowns.findIndex(dropdown => dropdown.options.findIndex(option => option.path === path.pathname.toLowerCase()) !== -1)
        if(idx !== -1) {
            const dropdowns = [false, false, false];
            dropdowns[idx] = true;
            setActiveDropdown(dropdowns);
        }
    }, [path]);

    return (
        <div className='admin-container'>
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
                                        <Link to={option.path} key={idx}>
                                            <div className={`option ${option.path === path.pathname ? 'selected' : ''}`}>
                                                { option.title }
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='content'>
                <div className='header'>
                    Admin <MdKeyboardArrowRight /> { path.pathname.replace('/admin/', '').toCamelCase() }
                </div>
                <div className='component'>
                    { props.children }
                </div>
            </div>
        </div>
    )
}