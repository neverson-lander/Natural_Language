from mongoengine import *
from classify import *
from intent import *
from sentence import *
import sys
connect('test')

training_data = []
token = sys.argv[1]

classify = Classifies.objects(classifyToken = token).first()
if(classify != None):
    for intent in Intents.objects(idClassify = classify._id):
        for sentence in Sentences.objects(idIntent = intent._id):
            training_data.append({"class":intent.intentName, "sentence":sentence.desSentence})