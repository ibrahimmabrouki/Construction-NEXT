import api from "./axios";
import { IconName } from "@/lib/iconMap";

interface Service {
  _id: string;
  iconName: IconName;
  title: string;
  desc: string;
}

//client service to get all the services
export const getAllServices = async (): Promise<Service[]> => {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL}`,
  );

  return response.data.services.map((service: any) => ({
    _id: service._id,
    iconName: service.icon as IconName,
    title: service.title,
    desc: service.desc,
  }));
};

//client service to create new service
export const createService = async (service: Omit<Service, "_id">) => {
  try {
    const newService = {
      icon: service.iconName,
      title: service.title,
      desc: service.desc,
    };

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL}`,
      newService,
    );
    const s = response.data.data;
    return {
      _id: s._id,
      iconName: s.icon,
      title: s.title,
      desc: s.desc,
    };
  } catch (error: any) {
    console.log({ error: error.message });
    throw error;
  }
};

//client service to edit service by id
export const editService = async (
  service: Omit<Service, "_id">,
  _id: string,
) => {
  try {
    const newService = {
      icon: service.iconName,
      title: service.title,
      desc: service.desc,
    };

    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL}/${_id}`,
      newService,
    );

    const s = response.data.data;

    return {
      _id: s._id,
      iconName: s.icon,
      title: s.title,
      desc: s.desc,
    };
  } catch (error: any) {
    console.log({ error: error.message });
    throw error;
  }
};

//client service to delete a service
export const deleteService = async (_id: string) => {
  try {
    const response = await api.delete(
      `${process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL}/${_id}`,
    );

    const s = response.data.data;

    return {
      _id: s._id,
    };
  } catch (error: any) {
    console.log({ error: error.message });
    throw error;
  }
};
