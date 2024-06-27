import { IApplication } from "../entities/application.interface";
import { IRepository } from "./repository.interface";

export interface IApplicationRepository extends IRepository<IApplication>
{
}