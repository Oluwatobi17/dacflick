from rest_framework import serializers
from post.models import Post, Postcomment
from index.models import Wall, Following, User, WallReply, Contact, Event, Todotask

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = '__all__' 

class WallSerializer(serializers.ModelSerializer):
	class Meta:
		model = Wall
		fields = '__all__' 

class WallReplySerializer(serializers.ModelSerializer):
	class Meta:
		model = WallReply
		fields = '__all__' 


class FollowingSerializer(serializers.ModelSerializer):
	class Meta:
		model = Following
		fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Post
		fields = ('title', 'body', 'postType', 'category')

class AddPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Post
		fields = ('user','title', 'body', 'postType', 'category', 'id')


class PostCommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Postcomment
		fields = ('author', 'body', 'targetpost')

		
class ContactMsgSerializer(serializers.ModelSerializer):
	class Meta:
		model = Contact
		fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
	class Meta:
		model = Event
		fields = '__all__'

		
class TodotaskSerializer(serializers.ModelSerializer):
	class Meta:
		model = Todotask
		fields = '__all__'