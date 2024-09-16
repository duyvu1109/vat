from djongo import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.management.utils import get_random_secret_key
class UserManager(BaseUserManager):

    def create_user(self, username, first_name, last_name, password=None, **kwargs):
        """Create and return a `User` with username, password, first_name and last_name"""
        if username is None:
            raise TypeError('Users must have a username.')

        user = self.model(username=username)
        user = self.model(first_name=first_name)        
        user = self.model(last_name=last_name)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError('Superusers must have a password.')
        if username is None:
            raise TypeError('Superusers must have an username.')

        user = self.create_user(username, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user
    
class User(AbstractBaseUser):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=256, unique=True, db_index=True)
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    password = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) # Field check admin or not, using this field of django
    
    # email, secret_key is used for gg authentication
    email = models.EmailField(default=False)
    secret_key = models.CharField(max_length=255, default=get_random_secret_key)

    is_block = models.BooleanField(default=False)
    max_feeds = models.IntegerField(default=10)
    max_dashboards = models.IntegerField(default=10)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = [username]

    objects = UserManager()

    def _str_(self):
        return self.username

class Dashboard(models.Model):
    _id = models.ObjectIdField() 
    name = models.CharField(max_length=256)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    link_public = models.URLField(max_length=256, default=False)
    public = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def _str_(self):
        return self.name

class Feed(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=256)
    value = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def _str_(self):
        return self.name

class Widget(models.Model):
    _id = models.ObjectIdField()
    type = models.CharField(max_length=256)
    name = models.CharField(max_length=256, blank=True)
    name_color = models.CharField(max_length=256, default="")
    x = models.FloatField()
    y = models.FloatField()
    w =  models.FloatField()
    h =  models.FloatField()
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
    feeds = models.ManyToManyField(Feed, null=True)

    def _str_(self):
        return self.name

class Gauge(Widget):
    number_of_element = models.IntegerField()
    signature = models.CharField(max_length=256)
    color = models.CharField(max_length=256, blank=True)
    text_color = models.CharField(max_length=256)
    arc_width = models.FloatField()
    animate = models.BooleanField()
    max_value = models.FloatField()

class Chart(Widget):
    signature = models.CharField(max_length=256)
    color_value = models.CharField(max_length=256)
    curve_type = models.CharField(max_length=256)
    grid_color = models.CharField(max_length=256)
    background = models.CharField(max_length=256)

class Card(Widget):
    value_color = models.CharField(max_length=256, blank=True)
    background_color = models.CharField(max_length=256, blank=True)
    signature = models.CharField(max_length=256, blank=True)
    image_data  = models.TextField(blank=True)

class Map(Widget):
    latitude = models.FloatField()
    longitude = models.FloatField()

class Control(Widget):
    on_color = models.CharField(max_length=256)
    off_color = models.CharField(max_length=256)
    number_auto_on = models.IntegerField()
    number_auto_off = models.IntegerField()

class Digital(Widget):
    widget_color = models.CharField(max_length=256)
    max_value = models.FloatField()
    min_value = models.FloatField()

class Statistic(Widget):
    equation = models.CharField(max_length=256)
    precision = models.IntegerField()
    suffix = models.CharField(max_length=256)
    background = models.CharField(max_length=256)
    value_color = models.CharField(max_length=256)

class FeedValue(models.Model):
    _id = models.ObjectIdField()
    value = models.CharField(max_length=256)
    time_stamp = models.DateTimeField(auto_now=True)
    topic = models.CharField(max_length=256)
    