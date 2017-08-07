from mongoengine import *

class Classifies(Document):
    _id = ObjectIdField(required=False)
    classifyName = StringField(required=True)
    desClassify = StringField(required=True)
    dtInsert = DateTimeField(required=True)
    dtUpdate = DateTimeField(required=False)
    idUser = ObjectIdField(required=True)
    classifyToken = StringField(required=True)
    version = IntField(db_field="__v", required=False)  