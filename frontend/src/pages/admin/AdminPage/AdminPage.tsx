import { IoIosOptions } from 'react-icons/io'
import './AdminPage.css'
import { FaClipboardList } from 'react-icons/fa'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useState } from 'react'

export default function AdminPage() {

    const [activeDropdown, setActiveDropdown] = useState<boolean[]>([false, false, false]);

    const dropdowns = [
        {
            title: 'General',
            icon: <IoIosOptions />,
            options: [
                {
                    title: "Users",
                },
                {
                    title: "System Config"
                }
            ]
        },
        {
            title: 'Problems',
            icon: <FaClipboardList />,
            options: [
                {
                    title: "Problem List",
                },
                {
                    title: "Create Problem"
                }
            ]
        },
        {
            title: 'Contests',
            icon: <FaClipboardList />,
            options: [
                {
                    title: "Contests List",
                },
                {
                    title: "Create Contest"
                }
            ]
        }
    ]

    function toggleDropdown(idx: number) {
        const dropdowns = [...activeDropdown];
        dropdowns[idx] = !dropdowns[idx];
        setActiveDropdown(dropdowns);
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
                                        <div className='option' key={idx}>
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
                Content
            </div>
        </div>
    )
}