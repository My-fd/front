import {useEffect, useState} from "react";
import {API} from "../app/api/api";
import _ from "lodash";

export const useCategories  = (props) => {
    const {category: categoryId, subcategory: subcategoryId} = props
    const [category, setCategory] = useState<any>([]);
    const [subcategory, setSubcategory] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [attributes, setAttributes] = useState([]);
    const [allAttributes, setAllAttributes] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    useEffect(()=>{
        API.getCategories()
            .then(({ data }) => {
                setCategories(data.data)
                if(categoryId){
                    const cat =_.find(data.data, {id: +categoryId})
                    setCategory(cat)
                    setSubcategories(cat?.subcategory)
                    if(subcategoryId) setSubcategory(_.find(cat?.subcategory, {id: +subcategoryId}))
                }
                setAllAttributes(_.values(getAttributes(data.data)))
                return data.response;
            })
            .catch((res) => {
                console.log('error res', res)
            })
    }, []);

    useEffect(()=>{
        const attrs = subcategory?.attributes || _.values(getAttributes(category?.subcategory))
        setAttributes(!!attrs.length && !!categoryId ? attrs : [])
    }, [subcategory, category, allAttributes])

    useEffect(()=>{
        const cat =_.find(categories, {id: +categoryId})
        setCategory(cat)
        setSubcategories(cat?.subcategory)

    }, [categoryId, categories])

    useEffect(()=>{
        setSubcategory(_.find(subcategories, {id: +subcategoryId}))
    }, [category, subcategoryId, categoryId, subcategories])

    return {categories, attributes, subcategories, category, subcategory}
}

function getAttributes (categories){
    let attrs = {}
    categories?.map((c)=>{
        let att = _.merge({}, getAttributes(c.subcategory), _.keyBy(c.attributes, 'id'))
        _.forEach(att, (a)=> (attrs[a.id] = a))
    })
    return attrs
}