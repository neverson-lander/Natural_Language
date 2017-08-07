from mongoengine import *
from intent import *

class Sentences(Document):
    _id = ObjectIdField(required=False)
    desSentence = StringField(required=True)
    idIntent = ReferenceField(Intents)
    dtInsert = DateTimeField(required=True)
    dtUpdate = DateTimeField(required=False)
    idUser = ObjectIdField(required=True)
    version = IntField(db_field="__v", required=False)