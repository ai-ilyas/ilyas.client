import { IApplication } from "../entities/application.interface";
import { RepositoryInterface } from "./repository.interface";

export interface IApplicationRepository extends RepositoryInterface<IApplication>
{
}