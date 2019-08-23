from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
	profilePics = models.FileField()
	aboutUser = models.TextField()
	numofnewnote = models.IntegerField(default=0)

	def __str__(self):
		return self.username
# 

from post.models import Post

class Following(models.Model):
	member = models.CharField(max_length=500, default='Anonymous')
	follow = models.ForeignKey(User, on_delete=models.CASCADE)
	date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return (self.follow)


class View(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	post = models.ForeignKey(Post, on_delete=models.CASCADE)

	
class Wall(models.Model):
	user = models.CharField(max_length=500)
	writer = models.ForeignKey(User, on_delete=models.CASCADE)
	body = models.TextField()
	date = models.DateTimeField(auto_now=True)

class WallReply(models.Model):
	wall = models.ForeignKey(Wall, on_delete=models.CASCADE)
	body = models.CharField(max_length=500)
	writer = models.ForeignKey(User, on_delete=models.CASCADE)
	date = models.DateTimeField(auto_now=True)


class Favour(models.Model):
	favouredBy = models.ForeignKey(User, on_delete=models.CASCADE)
	post = models.ForeignKey(Post, on_delete=models.CASCADE)
	date = models.DateTimeField(auto_now=True)


class Notification(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	message = models.CharField(max_length=500)
	url = models.URLField(max_length=10000, default='/post')
	img = models.CharField(max_length=500, default='create.jpg')
	date = models.DateTimeField(auto_now=True)


class Likepage(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	fan = models.CharField(max_length=500) # username of the person that like your page
	date = models.DateTimeField(auto_now=True)

class Contact(models.Model):
	subject = models.CharField(max_length=1000)
	sender = models.CharField(max_length=500)
	email = models.CharField(max_length=500)
	message = models.TextField()
	date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.sender

class Quoteoftheday(models.Model):
	post = models.ForeignKey(Post, on_delete=models.CASCADE)

	def __str__(self):
		return self.post.title


class Jokeoftheday(models.Model):
	post = models.ForeignKey(Post, on_delete=models.CASCADE)

	def __str__(self):
		return self.post.title



class Motivationoftheday(models.Model):
	post = models.ForeignKey(Post, on_delete=models.CASCADE)

	def __str__(self):
		return self.post.title


class Oneofakind(models.Model):
	post = models.ForeignKey(Post, on_delete=models.CASCADE)

	def __str__(self):
		return self.post.title


class Selectionoftheday(models.Model):
	post = models.ForeignKey(Post, on_delete=models.CASCADE)

	def __str__(self):
		return self.post.title

class Event(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	title = models.CharField(max_length=500)
	date = models.DateTimeField(auto_now=True)

class Todotask(models.Model):
	event = models.ForeignKey(Event, on_delete=models.CASCADE)
	task = models.CharField(max_length=1000)
	done = models.BooleanField(default=False)
