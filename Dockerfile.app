FROM python:3
WORKDIR /usr/src/Accunniscila
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY ./src/ .
COPY ./entry_point.sh .
EXPOSE 8000
RUN chmod +x entry_point.sh
CMD [ "./entry_point.sh" ]