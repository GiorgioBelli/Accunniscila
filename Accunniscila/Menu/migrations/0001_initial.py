# Generated by Django 2.1.10 on 2020-04-26 19:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('name', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('price', models.FloatField(default=0)),
                ('severity', models.IntegerField(default=0)),
                ('image', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Menu',
            fields=[
                ('name', models.CharField(max_length=50, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Pizza',
            fields=[
                ('name', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('image', models.CharField(max_length=200, null=True)),
                ('totalSlices', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='PizzaIngredients',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Menu.Ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='Slice',
            fields=[
                ('number', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.AddField(
            model_name='pizzaingredients',
            name='pslice',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Menu.Slice'),
        ),
        migrations.AddField(
            model_name='pizza',
            name='pizzaIngredients',
            field=models.ManyToManyField(to='Menu.PizzaIngredients'),
        ),
        migrations.AddField(
            model_name='menu',
            name='pizzas',
            field=models.ManyToManyField(to='Menu.Pizza'),
        ),
    ]