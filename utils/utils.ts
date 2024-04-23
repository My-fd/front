import _ from "lodash";

export function convertCategories (categories){
    let cat = {}
    _.map(categories, (i)=>{
        if(!i.parent_id) cat[i.id] = {...(cat[i.id]||{}), ...i}
        if(!!i.parent_id) cat[i.parent_id].subcategories = _.concat((cat[i.parent_id].subcategories || []), i)
    })
    return cat
}

export async function convertFileToBase64(files) {
    const filePromises = files.map((file, i) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    resolve(reader.result);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    });

    const fileInfos = await Promise.all(filePromises);

    return fileInfos;
};
