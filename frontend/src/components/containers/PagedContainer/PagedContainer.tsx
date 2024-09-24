import './PagedContainer.css'
import IPagedContainer from './IPagedContainer';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';

export default function PagedContainer<T>(props: IPagedContainer<T>) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
    const [maxPage, setMaxPage] = useState<number>(0);

    useEffect(() => {
        const page = Number(searchParams.get('page')) || 1;

        axiosInstance.get(`/submission/all?page=${page}`)
        .then(res => {
            const submissions = res.data.data as T[]
            props.setValues(submissions);

            setMaxPage(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setSearchParams({ page: res.data.currentPage });
        })
        .catch(() => {});
    }, [searchParams])

    const getNewPageLink = (newPage: number) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('page', newPage.toString());
        return `?${newSearchParams.toString()}`;
    };

    return (
        <div className='paged-container'>
            <h3>{ props.title }</h3>
            <div className='search-area'>
            </div>
            {
                props.children
            }
            <div className='footer-pages'>
                {currentPage > 2 &&
                    <Link to={getNewPageLink(1)}>
                        { 1}
                    </Link>
                }
                {currentPage > 3 &&
                    <span>...</span>
                }
                {currentPage > 1 &&
                    <Link to={getNewPageLink(currentPage-1)}>
                        { currentPage - 1}
                    </Link>
                }
                <Link to={getNewPageLink(currentPage)} className='active'>
                    { currentPage }
                </Link>
                {currentPage + 1 <= maxPage &&
                    <Link to={getNewPageLink(currentPage+1)}>
                        { currentPage + 1}
                    </Link>
                }
                { currentPage + 2 <= maxPage &&
                    <span>...</span>
                }
                {currentPage + 2 <= maxPage &&
                    <Link to={getNewPageLink(maxPage)}>
                        { maxPage }
                    </Link>
                }
            </div>
        </div>
    )
}