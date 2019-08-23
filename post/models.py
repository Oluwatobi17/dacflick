from django.db import models
from index.models import User

# Create your models here.


class Post(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	title = models.CharField(max_length=250, default='Not set')
	body = models.TextField()
	postType = models.CharField(max_length=100)
	category = models.CharField(max_length=100)
	edited = models.BooleanField(default=False)
	background = models.CharField(max_length=1000, default='na2.jpg')
	date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.title+'-'+self.postType

class Postcomment(models.Model):
	targetpost = models.ForeignKey(Post, on_delete=models.CASCADE)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	body = models.CharField(max_length=500)
	date = models.DateTimeField(auto_now=True)

