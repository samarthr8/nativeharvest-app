{{- define "nativeharvest.name" -}}
nativeharvest
{{- end }}

{{- define "nativeharvest.labels" -}}
app: nativeharvest
environment: {{ .Values.environment }}
{{- end }}

