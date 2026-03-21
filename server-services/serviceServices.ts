import Service from "@/models/services";

//Get all services
export async function findAllServices(){
    const services = await Service.find();
    return services;
}