import { Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly _logger: Logger;
  constructor(protected readonly model: Model<TDocument>) { }
  async create(docuemnt: Omit<TDocument, "_id">): Promise<TDocument> {
    const newDocument = new this.model({ ...docuemnt, _id: new Types.ObjectId })
    return (await (newDocument.save())).toJSON() as unknown as TDocument
  }
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true })
    if (!document) {
      this._logger.warn("Docuemtn not found with filterQuery", filterQuery)
      throw new NotFoundException("Document not found")
    }
    return document
  }

  async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, { lean: true, new: true })
    if (!document) {
      this._logger.warn("Docuemtn not found with filterQuery", filterQuery)
      throw new NotFoundException("Document not found")
    }
    return document
  }
  async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery, { lean: true })
    if (!document) {
      this._logger.warn("Docuemtn not found with filterQuery", filterQuery)
      throw new NotFoundException("Document not found")
    }
    return document
  }
  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery, {}, { lean: true })
  }
}
