from mongoengine import *
from classify import *

class Intents(Document):
    _id = ObjectIdField(required=False)
    intentName = StringField(required=True)
    idClassify = ReferenceField(Classifies)
    dtInsert = DateTimeField(required=True)
    dtUpdate = DateTimeField(required=False)
    idUser = ObjectIdField(required=True)
    version = IntField(db_field="__v", required=False)