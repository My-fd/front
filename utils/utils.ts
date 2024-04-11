import _ from "lodash";

export function convertCategories (categories){
    let cat = {}
    _.map(categories, (i)=>{
        if(!i.parent_id) cat[i.id] = {...(cat[i.id]||{}), ...i}
        if(!!i.parent_id) cat[i.parent_id].subcategories = _.concat((cat[i.parent_id].subcategories || []), i)
    })
    return cat
}