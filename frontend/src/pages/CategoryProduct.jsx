import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'
import { FaFilter } from 'react-icons/fa';

const CategoryProduct = () => {
    const [data, setData] = useState([])
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true
    })

    const handleToggleFilters = () => {
        setIsFiltersVisible(prev => !prev);
    };

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList, setFilterCategoryList] = useState([])

    const [sortBy, setSortBy] = useState("")

    const fetchData = async () => {
        const response = await fetch(SummaryApi.filterProduct.url, {
            method: SummaryApi.filterProduct.method,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                category: filterCategoryList
            })
        })

        const dataResponse = await response.json()
        setData(dataResponse?.data || [])
    }

    const handleSelectCategory = (e) => {
        const { value, checked } = e.target

        setSelectCategory((preve) => {
            return {
                ...preve,
                [value]: checked
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, [filterCategoryList])

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
            if (selectCategory[categoryKeyName]) {
                return categoryKeyName
            }
            return null
        }).filter(el => el)

        setFilterCategoryList(arrayOfCategory)

        //format for url change when change on the checkbox
        const urlFormat = arrayOfCategory.map((el, index) => {
            if ((arrayOfCategory.length - 1) === index) {
                return `category=${el}`
            }
            return `category=${el}&&`
        })

        navigate("/product-category?" + urlFormat.join(""))
    }, [selectCategory])


    const handleOnChangeSortBy = (e) => {
        const { value } = e.target

        setSortBy(value)

        if (value === 'asc') {
            setData(preve => preve.sort((a, b) => a.sellingPrice - b.sellingPrice))
        }

        if (value === 'dsc') {
            setData(preve => preve.sort((a, b) => b.sellingPrice - a.sellingPrice))
        }
    }

    useEffect(() => {

    }, [sortBy])

    return (
        <div className='container mx-auto p-4 mt-6'>
            <div className='flex flex-col lg:flex-row'>
                {/* Toggle Button for Mobile */}
                <button
                    className='lg:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center'
                    onClick={handleToggleFilters}
                >
                    <FaFilter className='inline-block mr-2' />
                    {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Sidebar / Filters */}
                <div
                    className={`w-full lg:w-64 bg-white p-4 mb-4 lg:mb-0 lg:mr-4 transition-transform ${isFiltersVisible ? 'block' : 'hidden lg:block'}`}
                >
                    {/* Sort by */}
                    <div className='mb-6'>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
                        <form className='text-sm flex flex-col gap-2 py-2'>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value="asc" id="sort-asc" />
                                <label htmlFor="sort-asc">Price - Low to High</label>
                            </div>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value="dsc" id="sort-dsc" />
                                <label htmlFor="sort-dsc">Price - High to Low</label>
                            </div>
                        </form>
                    </div>

                    {/* Category filter */}
                    <div>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
                        <form className='text-sm flex flex-col gap-2 py-2'>
                            {productCategory.map((categoryName, index) => (
                                <div key={index} className='flex items-center gap-3'>
                                    <input
                                        type='checkbox'
                                        name="category"
                                        checked={selectCategory[categoryName?.value]}
                                        value={categoryName?.value}
                                        id={categoryName?.value}
                                        onChange={handleSelectCategory}
                                    />
                                    <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>

                {/* Main content / Products */}
                <div className='flex-1'>
                    <p className='font-medium text-slate-800 text-lg mb-4'>Search Results: {data.length}</p>
                    <div className='overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-120px)]'>
                        {data.length !== 0 && !loading && (
                            <VerticalCard data={data} loading={loading} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CategoryProduct