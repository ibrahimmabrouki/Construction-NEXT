import Category from "@/models/category";
import {Types} from "mongoose";


export async function findCategory(userId: Types.ObjectId){
    return await Category.findById({user: userId})
}