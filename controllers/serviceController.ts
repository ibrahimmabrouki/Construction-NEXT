import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/db";
import { findAllServices } from "@/server-services/serviceServices";
import Service from "@/models/services";

//controller to get all services
export async function getAllServices(request: Request) {
  try {
    await connect();

    const services = await findAllServices();

    return NextResponse.json({ success: true, services });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching Services" },
      { status: 500 },
    );
  }
}

//controller to get the first 4 services
export async function getFeaturedServices(request: Request) {
  try {
    await connect();
    const services = await findAllServices();
    const featuredServices = services.slice(0, 4);
    return NextResponse.json({ success: true, services: featuredServices });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching Services" },
      { status: 500 },
    );
  }
}

interface ServiceType {
  icon: String;
  title: String;
  desc: String;
}

//method to create the service.
export async function createService(request: NextRequest) {
  try {
    const body: ServiceType = await request.json();

    const { icon, title, desc } = body;

    if (!icon || !title || !desc) {
      return NextResponse.json(
        { message: "All fields (icon, title, desc) are required" },
        { status: 400 },
      );
    }

    await connect();

    const service = await Service.create({
      icon,
      title,
      desc,
    });

    if (!service) {
      return NextResponse.json(
        { message: "Failed to create service" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Service created successfully",
        data: service,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create Service Error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

//method to update the service.
export async function updateService(request: NextRequest, id: string) {
  try {
    const body: ServiceType = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 },
      );
    }

    await connect();

    const updatedService = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Service updated successfully",
        data: updatedService,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Update Service Error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

//method to delete a service
export async function deleteService(request: NextRequest, id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 },
      );
    }

    await connect();

    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Service deleted successfully",
        data: deletedService,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Delete Service Error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
