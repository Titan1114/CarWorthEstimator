import { Expose, Transform } from "class-transformer";

export class ReportDto{
    @Expose()
    make: string;

    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    model: string;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    @Expose()
    @Transform(({obj})=>obj.user.id)
    userId: number;
}