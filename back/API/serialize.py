def serialize_mongo_id(doc):
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc
